import { apiRequest } from '../api/apiRequestService';
import { verificarCamposPreenchidos } from './utils/formValidator';
import { formatarDataParaBrasileiro } from './utils/formUtils';

const camposNecessarios = [
    'nomeCompleto',
    'dataNascimento',
    'cpf',
    'nomeMae'
];

export const gerarCertidaoJusticaMilitar = async (formData: { [key: string]: any }, setPdfUrls: (urls: { [key: string]: string | null }) => void, uuid: string | null) => {

    if (!verificarCamposPreenchidos(formData, camposNecessarios)) {
        console.log("Campos obrigatórios não preenchidos.");
        return;
    }

    console.log("Gerando certidão justiça militar");

    const dataFormatada = formatarDataParaBrasileiro(formData.dataNascimento);

    const formDataCombinado = {
        ...formData,
        dataNascimento: dataFormatada,
        uuid
    }

    try {

        const response = await apiRequest({
            tipo: "gerarCertidaoMilitar",
            data: formDataCombinado
        });

        const parsedResponse = JSON.parse(response);

        const urls = {
            certidaoJusticaMilitar: parsedResponse.urls?.certidaoJusticaMilitar || null,
        };

        setPdfUrls(urls);
    } catch (error) {
        console.error("Erro ao gerar pdf militar:", error);
    }
}