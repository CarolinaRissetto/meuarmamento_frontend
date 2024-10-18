import { apiRequest } from '../api/apiRequestService';
import { verificarCamposPreenchidos } from './utils/formValidator';
import { formatarDataParaBrasileiro } from './utils/formUtils';
import { buscarDocumentosPolling } from '../../pages/autorizacaoArma/sections/utils/BuscarDocumentosPolling';

const camposNecessarios = [
    'nomeCompleto',
    'dataNascimento',
    'cpf',
    'nomeMae'
];

export const gerarCertidaoJusticaMilitar = async (formData: { [key: string]: any },
    setFormData: (data: any) => void,
    setPdfUrls: React.Dispatch<React.SetStateAction<{ [key: string]: { url: string | null; status: string | null; }; }>>,
    uuid: string | null
) => {

    if (!verificarCamposPreenchidos(formData, camposNecessarios)) {
        console.log("Campos obrigatórios não preenchidos.");
        return;
    }

    console.log("Gerando certidão justiça militar");

    setPdfUrls((prevPdfUrls) => ({
        ...prevPdfUrls,
        certidaoJusticaMilitar: { url: null, status: 'INICIADO' },
    }));

    buscarDocumentosPolling(setFormData, setPdfUrls, uuid);

    const dataFormatada = formatarDataParaBrasileiro(formData.dataNascimento);

    const formDataCombinado = {
        ...formData,
        dataNascimento: dataFormatada,
        uuid
    }

    try {

        await apiRequest({
            tipo: "gerarCertidaoMilitar",
            data: formDataCombinado
        });

    } catch (error) {
        console.error("Erro ao gerar pdf militar:", error);
    }
};