import { apiRequest } from '../api/apiRequestService';
import { verificarCamposPreenchidos } from './utils/formValidator';

const camposNecessarios = [
    'cpf'
];

export const gerarCertidaoJusticaFederal = async (formData: { [key: string]: any },
    setPdfUrls: (callback: (prevUrls: { [key: string]: string | null }) => { [key: string]: string | null }) => void,
    uuid: string | null) => {

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

        setPdfUrls((prevUrls) => ({
            ...prevUrls,
            certidaoJusticaFederal: response || null,
        }));
    } catch (error) {
        console.error("Erro ao gerar pdf federal:", error);
    }
};