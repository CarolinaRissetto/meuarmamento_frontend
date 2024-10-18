import { apiRequest } from '../api/apiRequestService';
import { verificarCamposPreenchidos } from './utils/formValidator';
import { buscarDocumentosPolling } from '../../pages/autorizacaoArma/sections/utils/BuscarDocumentosPolling';

const camposNecessarios = [
    'cpf'
];

export const gerarCertidaoJusticaFederal = async (formData: { [key: string]: any },
    setFormData: (data: any) => void,
    setPdfUrls: React.Dispatch<React.SetStateAction<{ [key: string]: { url: string | null; status: string | null; }; }>>,
    uuid: string | null
) => {

    if (!verificarCamposPreenchidos(formData, camposNecessarios)) {
        console.log("Campos obrigatórios não preenchidos.");
        return;
    }

    console.log("Gerando certidão justiça federal");

    setPdfUrls((prevPdfUrls) => ({
        ...prevPdfUrls,
        certidaoJusticaFederal: { url: null, status: 'INICIADO' },
    }));

    buscarDocumentosPolling(setFormData, setPdfUrls, uuid);

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