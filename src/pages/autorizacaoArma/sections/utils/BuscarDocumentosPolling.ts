import { apiRequest } from "../../../../services/api/apiRequestService";

let currentPollingIntervalId: number | NodeJS.Timeout | null = null;

const buscarDocumentosEAtualizarLocalStorage = async (
    setFormData: (data: any) => void,
    setPdfUrls: React.Dispatch<React.SetStateAction<{ [key: string]: { url: string | null; status: string | null; }; }>>,
    uuid: string | null
) => {
    try {
        const response = await apiRequest({
            tipo: "buscaDados",
            data: {
                uuid,
            },
        });

        if (response) {
            const parsedData = typeof response === "string" ? JSON.parse(response) : response;
            let data = parsedData;

            if (data.body) {
                data = data.body;
            }

            console.log('Dados obtidos:', data);

            const documentosAtualizados = mapearDadosDocumentos(data.documentos);

            const storedData = localStorage.getItem(`form-data-${uuid}`);
            const existingData = storedData ? JSON.parse(storedData) : {};
            const updatedData = {
                ...existingData,
                documentos: data.documentos,
            };
            localStorage.setItem(`form-data-${uuid}`, JSON.stringify(updatedData));

            setFormData(updatedData);
            setPdfUrls(documentosAtualizados);

            return documentosAtualizados;
        }
    } catch (error) {
        console.error("Erro ao buscar documentos:", error);
        throw error;
    }
};

const mapearDadosDocumentos = (documentos: { [key: string]: any }) => {
    const documentosMapeados: { [key: string]: { url: string | null, status: string | null } } = {};

    Object.keys(documentos).forEach((tipoDocumento) => {
        documentosMapeados[tipoDocumento] = {
            url: documentos[tipoDocumento]?.url || null,
            status: documentos[tipoDocumento]?.status || null,
        };
    });

    return documentosMapeados;
};

const buscouTodosDocumentos = (documentos: {
    [key: string]: { url: string | null; status: string | null; };
} | undefined
) => {
    return documentos && Object.values(documentos).every(doc => doc?.status === 'concluido');
};

export const buscarDocumentosPolling = (
    setFormData: (data: any) => void,
    setPdfUrls: React.Dispatch<React.SetStateAction<{ [key: string]: { url: string | null; status: string | null; }; }>>,
    uuid: string | null,
    checkInterval = 9000,
    maxAttempts = 20
) => {
    if (currentPollingIntervalId) {
        clearInterval(currentPollingIntervalId);
        console.log("Polling anterior interrompido para iniciar um novo.");
    }

    let attempts = 0;

    currentPollingIntervalId = setInterval(async () => {
        attempts += 1;
        console.log(`Tentativa ${attempts} de ${maxAttempts}`);

        try {
            const documentos = await buscarDocumentosEAtualizarLocalStorage(setFormData, setPdfUrls, uuid);

            if (buscouTodosDocumentos(documentos)) {
                console.log("Todos os 5 documentos foram obtidos. Parando o polling.");
                clearInterval(currentPollingIntervalId as NodeJS.Timeout | number);
                currentPollingIntervalId = null;
            } else if (attempts >= maxAttempts) {
                console.log("Número máximo de tentativas alcançado. Parando o polling.");
                clearInterval(currentPollingIntervalId as NodeJS.Timeout | number);
                currentPollingIntervalId = null;
            }
        } catch (error) {
            console.error("Erro durante o polling:", error);
            clearInterval(currentPollingIntervalId as NodeJS.Timeout | number);
            currentPollingIntervalId = null;
        }
    }, checkInterval);
};
