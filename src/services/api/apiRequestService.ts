import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL as string;

interface ApiRequestOptions {
    method: 'POST' | 'GET' | 'PATCH';
    endpoint: string;
    path?: string;      // Caminho específico para a requisição
    data?: any;         // Dados para POST ou PATCH
}

export const apiRequest = async (options: ApiRequestOptions) => {
    const { method, endpoint, path, data } = options;

    if (!API_URL) {
        throw new Error('REACT_APP_API_URL não está definida.');
    }

    try {

        let requestData = data;

        if (method.toUpperCase() === 'PATCH') {
            if (Array.isArray(data)) {
                requestData = data.map(update => ({
                    path: update.path,
                    value: update.value
                }));
            } else {
                requestData = [
                    {
                        path: path,
                        value: data
                    }
                ];
            }
        }

        const response = await axios({
            url: `${API_URL}${endpoint}`,
            method,
            data: requestData,
            headers: {
                'Content-Type': 'application/json',
            },
        });

        console.log('Response data:', response);
        return response;
    } catch (error) {
        console.error(`There was an error`, error);
        return {
            status: 500,
            data: "Axios Error"
        };
    }
};
