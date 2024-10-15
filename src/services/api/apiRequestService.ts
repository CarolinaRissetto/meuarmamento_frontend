import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL as string;

export const apiRequest = async (data?: any) => {

    if (!API_URL) {
        throw new Error('REACT_APP_API_URL não está definida.');
    }

    try {
        const response = await axios.post(API_URL, data, {
            headers: {
                'Content-Type': 'application/json',
            },
        });

        console.log('Response data:', response.data);
        return response.data;
    } catch (error) {
        console.error(`There was an error`, error);
        return null;
    }
};