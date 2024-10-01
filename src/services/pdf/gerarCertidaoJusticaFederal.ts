import { apiRequest } from '../api/apiRequestService';
import { verificarCamposPreenchidos } from './utils/formValidator';

const camposNecessarios = [
    'cpf'
];

export const gerarCertidaoJusticaFederal = async (formData: { [key: string]: any }, setPdfUrls: (urls: { [key: string]: string | null }) => void, uuid: string | null) => {

    if (!verificarCamposPreenchidos(formData, camposNecessarios)) {
        console.log("Campos obrigatórios não preenchidos.");
        return;
    }

    console.log("Gerando certidão justiça federal");

    const formDataCombinado = {
        ...formData,
        uuid
    }

    try {

        const response = await apiRequest({
            tipo: "gerarCertidaoFederal",
            data: formDataCombinado
        });

        const parsedResponse = JSON.parse(response);

        const urls = {
            certidaoJusticaFederal: parsedResponse.urls?.certidaoJusticaFederal || null,
        };

        setPdfUrls(urls);
    } catch (error) {
        console.error("Erro ao gerar pdf federal:", error);
    }
}