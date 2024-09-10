import { apiRequest } from '../api/apiRequestService';

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
    'uuid'
];

const verificarCamposPreenchidos = (formData: { [key: string]: any }): boolean => {
    return camposNecessarios.every(campo => {
        let valor;

        if (campo in formData) {
            valor = formData[campo];
        } else if (campo in (formData.endereco || {})) {
            valor = formData.endereco[campo];
        }

        return valor !== undefined && valor !== null && valor !== ''; 
    });
};

export const gerarPdf = async (
    formData: { [key: string]: any }, 
    uuid: string | null, 
    setPdfUrls: (urls: { [key: string]: string | null }) => void
) => {

    if (!verificarCamposPreenchidos(formData)) {
        console.log("Campos obrigatórios não preenchidos.");
        return; 
    }

    // Desestruture o objeto 'endereco' do formData
    const { endereco = {}, ...outrosDados } = formData;

    // Combine os dados do endereço com os demais campos
    const formDataCombinado = {
        ...outrosDados,
        ...endereco,  // Aqui você espalha as chaves do endereço no nível superior
    };
    
    console.log("GERANDO PDF");

    try {
        const hoje = new Date();
        const dia = hoje.getDate().toString().padStart(2, '0');
        const mes = (hoje.getMonth() + 1).toString().padStart(2, '0'); // Meses são indexados de 0 a 11
        const ano = hoje.getFullYear();
        const dataAtual = `${formDataCombinado.cidade}, ${dia} de ${mes} de ${ano}`;

        const formDataComData = {
            ...formDataCombinado,
            local_data: dataAtual
        };

        const response = await apiRequest({
            tipo: "gerarPDF",
            data: formDataComData,
        });

        const parsedResponse = JSON.parse(response);

        const urls = {
            segurancaAcervo: parsedResponse.urls?.segurancaAcervo || null,
            declaracaoIdoneidade: parsedResponse.urls?.declaracaoIdoneidade || null,
        };

        setPdfUrls(urls); 

    } catch (error) {
        console.error("Erro ao chamar a API de geração de PDF:", error);
    }
};
