import { Console } from 'console';
import { apiRequest } from '../services/apiService';
import DocumentosParaAssinar from './DocumentosParaAssinar';

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
        const valor = formData[campo];
        return valor !== undefined && valor !== null && valor !== '';
    });
};

export const gerarPdf = async (formData: { [key: string]: any }, uuid: string | null, setPdfUrl: (url: string | null) => void
) => {

    // Desestruture o objeto 'endereco' do formData
    const { endereco = {}, ...outrosDados } = formData;

    // Combine os dados do endereço com os demais campos
    const formDataCombinado = {
        ...outrosDados,
        ...endereco,  // Aqui você espalha as chaves do endereço no nível superior
    };

    console.log(Object.keys(formDataCombinado));  // Liste todas as chaves em formDataCombinado

    console.log("GERANDO PDF");
    if (!uuid || !verificarCamposPreenchidos(formDataCombinado)) return;
    console.log(uuid);

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

        // Supondo que você tenha uma função no backend que gera o PDF a partir dos dados do formulário
        const response = await apiRequest({
            tipo: "gerarPDF",
            data: formDataComData,
        });

        let apiResponse = JSON.parse(response)

        if (response && apiResponse.url) {
            setPdfUrl(apiResponse.url);  // Atualize o pdfUrl aqui
        }

    } catch (error) {
        console.error("Erro ao chamar a API de geração de PDF:", error);
    }
};
