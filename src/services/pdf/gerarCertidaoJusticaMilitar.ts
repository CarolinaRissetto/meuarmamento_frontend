import { apiRequest } from '../api/apiRequestService';
import { verificarCamposPreenchidos } from './utils/formValidator';
import { formatarDataParaBrasileiro } from './utils/formUtils';
import { buscarDocumentosPolling } from '../../pages/autorizacaoArma/sections/utils/BuscarDocumentosPolling';
import { ProcessoAggregate } from '../../pages/autorizacaoArma/domain/ProcessoAggregate';

const camposNecessarios = [
    'nomeCompleto',
    'dataNascimento',
    'cpf',
    'nomeMae'
];

export const gerarCertidaoJusticaMilitar = async (
    uuid: string | null,
    setPdfUrls: React.Dispatch<React.SetStateAction<{ [key: string]: { url: string | null; status: string | null; }; }>>,
    processoAggregate: ProcessoAggregate,
    setProcessoAggregate: React.Dispatch<React.SetStateAction<ProcessoAggregate>>,
) => {

    if (!verificarCamposPreenchidos(processoAggregate, camposNecessarios)) {
        console.log("Campos obrigatórios não preenchidos.");
        return;
    }

    console.log("Gerando certidão justiça militar");

    setPdfUrls((prevPdfUrls) => ({
        ...prevPdfUrls,
        certidaoJusticaMilitar: { url: null, status: 'INICIADO' },
    }));

    buscarDocumentosPolling(setProcessoAggregate, setPdfUrls, uuid);

    const dataFormatada = formatarDataParaBrasileiro(processoAggregate.dataNascimento!);

    const formDataCombinado = {
        ...processoAggregate,
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