import { apiRequest } from "../../../../services/api/apiRequestService";

let currentPollingIntervalId: number | NodeJS.Timeout | null = null;

const buscarDocumentosEAtualizarLocalStorage = async (
    setFormData: (data: any) => void,
    setPdfUrls: React.Dispatch<React.SetStateAction<{ [key: string]: string | null }>>,
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

            // Atualizar apenas a parte dos documentos no localStorage
            const storedData = localStorage.getItem(`form-data-${uuid}`);
            const existingData = storedData ? JSON.parse(storedData) : {};
            const updatedData = {
                ...existingData,
                documentos: data.documentos,
            };
            localStorage.setItem(`form-data-${uuid}`, JSON.stringify(updatedData));

            setFormData(updatedData);
            setPdfUrls(data.documentos);

            return data.documentos;
        }
    } catch (error) {
        console.error("Erro ao buscar documentos:", error);
        throw error; // Propaga o erro para o polling
    }
};

const buscouTodosDocumentos = (documentos: { [key: string]: string }) => {
    return documentos && Object.keys(documentos).length === 5;
};

export const buscarDocumentosPolling = (
    setFormData: (data: any) => void,
    setPdfUrls: React.Dispatch<React.SetStateAction<{ [key: string]: string | null }>>,
    uuid: string | null,
    checkInterval = 20000,
    maxAttempts = 12
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
                currentPollingIntervalId = null; // Reseta o ID do polling atual
            } else if (attempts >= maxAttempts) {
                console.log("Número máximo de tentativas alcançado. Parando o polling.");
                clearInterval(currentPollingIntervalId as NodeJS.Timeout | number);
                currentPollingIntervalId = null; // Reseta o ID do polling atual
            }
        } catch (error) {
            console.error("Erro durante o polling:", error);
            clearInterval(currentPollingIntervalId as NodeJS.Timeout | number);
            currentPollingIntervalId = null; // Reseta o ID do polling atual
        }
    }, checkInterval);
};
