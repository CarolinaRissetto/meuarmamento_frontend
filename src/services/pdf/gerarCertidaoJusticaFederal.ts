import { apiRequest } from '../api/apiRequestService';
import { verificarCamposPreenchidos } from './utils/formValidator';
import { buscarDocumentosPolling } from '../../pages/autorizacaoArma/sections/utils/BuscarDocumentosPolling';
import { ProcessoAggregate } from '../../pages/autorizacaoArma/domain/ProcessoAggregate';

const camposNecessarios = [
    'cpf',
    'nomeCompleto'
];

export const gerarCertidaoJusticaFederal = async (
    uuid: string | null,
    setPdfUrls: React.Dispatch<React.SetStateAction<{ [key: string]: { url: string | null; status: string | null; }; }>>,
    processoAggregate: ProcessoAggregate,
    setProcessoAggregate: React.Dispatch<React.SetStateAction<ProcessoAggregate>>,
) => {
    
    if (!verificarCamposPreenchidos(processoAggregate, camposNecessarios)) {
        console.log("Campos obrigatórios não preenchidos.");
        return;
    }

    console.log("Gerando certidão justiça federal");

    setPdfUrls((prevPdfUrls) => ({
        ...prevPdfUrls,
        certidaoJusticaFederal: { url: null, status: 'INICIADO' },
    }));

    buscarDocumentosPolling(setProcessoAggregate, setPdfUrls, uuid);

    const formDataCombinado = {
        ...processoAggregate,
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