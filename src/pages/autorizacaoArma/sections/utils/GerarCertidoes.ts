import { gerarCertidaoJusticaEstadual } from "../../../../services/pdf/gerarCertidaoJusticaEstadual";
import { gerarCertidaoJusticaFederal } from "../../../../services/pdf/gerarCertidaoJusticaFederal";
import { gerarCertidaoJusticaMilitar } from "../../../../services/pdf/gerarCertidaoJusticaMilitar";
import { ProcessoAggregate } from '../../domain/ProcessoAggregate';

export const gerarCertidoes = async (
    uuid: string | null,    
    setPdfUrls: React.Dispatch<React.SetStateAction<{ [key: string]: { url: string | null; status: string | null } }>>,
    processoAggregate: ProcessoAggregate,
    setProcessoAggregate: React.Dispatch<React.SetStateAction<ProcessoAggregate>>
) => {
    try {
        const promises = [
            gerarCertidaoJusticaEstadual(uuid, setPdfUrls, processoAggregate, setProcessoAggregate),
            gerarCertidaoJusticaMilitar(uuid, setPdfUrls, processoAggregate, setProcessoAggregate),
            gerarCertidaoJusticaFederal(uuid, setPdfUrls, processoAggregate, setProcessoAggregate),
        ];

        await Promise.all(promises);
    } catch (error) {
        console.error('Erro ao gerar múltiplos certificados:', error);
    }
};
