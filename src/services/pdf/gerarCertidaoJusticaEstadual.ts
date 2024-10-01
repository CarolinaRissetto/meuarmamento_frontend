import { apiRequest } from '../api/apiRequestService';
import { formatarDataParaBrasileiro } from './utils/formUtils';
import { verificarCamposPreenchidos } from './utils/formValidator';

const camposNecessarios = [
    'nome',
    'nomeMae',
    'nomePai',
    'cpf',
    'dataNascimento',
    'rg',
    'rua',
    'numero',
    'cidade',
    'bairro',
    'uf'
];

export const gerarCertidaoJusticaEstadual = async (formData: { [key: string]: any }, setPdfUrls: (urls: { [key: string]: string | null }) => void,     uuid: string | null) => {
    const sexo = "F";
    const estadoCivil = "1";

    if (!verificarCamposPreenchidos(formData, camposNecessarios)) {
        console.log("Campos obrigatórios não preenchidos.");
        return;
    }

    const endereco = `${formData.rua}, ${formData.numero}, ${formData.cidade} - ${formData.uf}`;

    const dataFormatada = formatarDataParaBrasileiro(formData.dataNascimento);

    const formDataCombinado = {
        ...formData,
        dataNascimento: dataFormatada,
        sexo,
        estadoCivil,
        endereco,
        uuid
    }

    console.log("Gerando certidão justiça federal");

    try {

        const response = await apiRequest({
            tipo: "gerarCertidaoEstadual",
            data: formDataCombinado
        });

        const parsedResponse = JSON.parse(response);

        const urls = {
            certidaoJusticaEstadual: parsedResponse.urls?.certidaoJusticaEstadual || null,
        };

        setPdfUrls(urls);
    } catch (error) {
        console.error("Erro ao gerar pdf federal:", error);
    }
}