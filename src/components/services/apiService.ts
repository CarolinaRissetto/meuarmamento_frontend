import axios from 'axios';

export const apiRequest = async (method: 'GET' | 'POST', params?: any, data?: any) => {
    try {
        const config = {
            method: method,
            url: `https://docq4oevx8.execute-api.us-east-1.amazonaws.com/Prod/processos`,
            headers: { 'Content-Type': 'application/json' },
            params: params || {},
            data: data || {}
        };
        const response = await axios(config);
        return response.data;
    } catch (error) {
        console.error(`There was an error with the ${method}:`, error);
        return null;
    }
};