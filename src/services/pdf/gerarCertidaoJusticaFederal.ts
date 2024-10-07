import { apiRequest } from '../api/apiRequestService';
import { verificarCamposPreenchidos } from './utils/formValidator';

const camposNecessarios = [
    'cpf'
];

export const gerarCertidaoJusticaFederal = async (formData: { [key: string]: any },
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

        await apiRequest({
            tipo: "gerarCertidaoFederal",
            data: formDataCombinado
        });

    } catch (error) {
        console.error("Erro ao gerar pdf federal:", error);
    }
};