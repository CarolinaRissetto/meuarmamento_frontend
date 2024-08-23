import { apiRequest } from '../services/apiService';

// Lista de campos necessários, incluindo o uuid
const camposNecessarios = [
    'nomeCompleto',
    'dataNascimento',
    'nacionalidade',
    'cpf',
    'rua',
    'numero',
    'cep',
    'cidade',
    'bairro',
    'uf',
    'uuid'  // Verificação adicional para garantir que o UUID está presente
];

const verificarCamposPreenchidos = (formData: { [key: string]: any }): boolean => {
    return camposNecessarios.every(campo => {
        let valor;

        if (campo in formData) {
            valor = formData[campo];
        } else if (campo in (formData.endereco || {})) {
            valor = formData.endereco[campo];
        }

        return valor !== undefined && valor !== null && valor !== ''; // Verifica se o valor não é undefined, null, ou string vazia
    });
};

export const gerarPdf = async (
    formData: { [key: string]: any }, 
    uuid: string | null, 
    setPdfUrls: (urls: { [key: string]: string | null }) => void // Agora recebemos um objeto com URLs
) => {

    if (!verificarCamposPreenchidos(formData)) {
        console.log("Campos obrigatórios não preenchidos.");
        return; // Se faltar algum campo, a função é encerrada
    }

    // Desestruture o objeto 'endereco' do formData
    const { endereco = {}, ...outrosDados } = formData;

    // Combine os dados do endereço com os demais campos
    const formDataCombinado = {
        ...outrosDados,
        ...endereco,  // Aqui você espalha as chaves do endereço no nível superior
    };

    console.log(Object.keys(formDataCombinado));  // Liste todas as chaves em formDataCombinado

    console.log("GERANDO PDF");

    try {
        // Obter a data atual e formatar como desejado
        const hoje = new Date();
        const dia = hoje.getDate().toString().padStart(2, '0');
        const mes = (hoje.getMonth() + 1).toString().padStart(2, '0'); // Meses são indexados de 0 a 11
        const ano = hoje.getFullYear();
        const dataAtual = `${formDataCombinado.cidade}, ${dia} de ${mes} de ${ano}`;

        // Adicionar local_data ao formDataCombinado
        const formDataComData = {
            ...formDataCombinado,
            local_data: dataAtual
        };

        // Chama a API para gerar os PDFs e receber as URLs
        const response = await apiRequest({
            tipo: "gerarPDF",
            data: formDataComData,
        });

        const parsedResponse = JSON.parse(response);

        // Verifica e atualiza as URLs no estado
        const urls = {
            segurancaAcervo: parsedResponse.urls?.segurancaAcervo || null,
            declaracaoIdoneidade: parsedResponse.urls?.declaracaoIdoneidade || null,
        };

        setPdfUrls(urls);  // Atualiza o estado com as URLs dos PDFs gerados

    } catch (error) {
        console.error("Erro ao chamar a API de geração de PDF:", error);
    }
};
