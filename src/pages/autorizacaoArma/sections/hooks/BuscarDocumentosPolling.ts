import { apiRequest } from "../../../../services/api/apiRequestService";
import { ProcessoAggregate } from "../../domain/ProcessoAggregate";

let currentPollingIntervalId: number | NodeJS.Timeout | null = null;

export const buscarDocumentosPolling = async (
    setProcessoAggregate: React.Dispatch<React.SetStateAction<ProcessoAggregate>>,
    idProcesso: string | null,
    checkInterval = 9000,
    maxAttempts = 20
) => {
    if (currentPollingIntervalId) {
        clearInterval(currentPollingIntervalId);
        console.log("Polling anterior interrompido para iniciar um novo.");
    }

    let attempts = 0;

    await buscarDocumentos(setProcessoAggregate, idProcesso);

    currentPollingIntervalId = setInterval(async () => {
        attempts += 1;
        console.log(`Tentativa ${attempts} de ${maxAttempts}`);

        try {
            const documentos = await buscarDocumentos(setProcessoAggregate, idProcesso);

            if (buscouTodosDocumentos(documentos)) {
                console.log("Todos os 5 documentos foram obtidos. Parando o polling.");
                cancelarPoolingDocumentos();
            } else if (attempts >= maxAttempts) {
                console.log("Número máximo de tentativas alcançado. Parando o polling.");
                cancelarPoolingDocumentos();
            }
        } catch (error) {
            console.error("Erro durante o polling:", error);
            cancelarPoolingDocumentos();
        }
    }, checkInterval);
};

export const cancelarPoolingDocumentos = () => {
    if (currentPollingIntervalId) {
        clearInterval(currentPollingIntervalId as NodeJS.Timeout | number);
        currentPollingIntervalId = null;
    }
};

const buscarDocumentos = async (
    setProcessoAggregate: React.Dispatch<React.SetStateAction<ProcessoAggregate>>,
    id: string | null
) => {
    try {
        const response = await apiRequest({
            method: 'GET',
            endpoint: `/${id}`,
        });

        if (response) {
            const parsedData = typeof response === "string" ? JSON.parse(response) : response;
            let data = parsedData.data || parsedData;

            console.log('Dados obtidos:', data);

            setProcessoAggregate((prevAggregate) => ({
                ...prevAggregate,
                documentos: Array.isArray(data.documentos) ? data.documentos.map((doc: any) => ({
                    id: doc.id,
                    nome: doc.nome,
                    status: doc.status,
                    urlDocumentoGerado: doc.urlDocumentoGerado,
                })) : [],
            }));

            return data.documentos;
        }
    } catch (error) {
        console.error("Erro ao buscar documentos:", error);
        throw error;
    }
};

const buscouTodosDocumentos = (documentos: {
    [key: string]: { url: string | null; status: string | null; };
} | undefined
) => {
    return documentos && Object.values(documentos).every(doc => doc?.status === 'Gerado');
};