import axios from 'axios';

export const apiRequest = async (data?: any) => {
    try {
        const response = await axios({
            method: 'POST',
            url: 'http://localhost:3001/processos',
            headers: {
                'Content-Type': 'application/json',
            },
            data: data,
        });

        console.log('Response data:', response.data);
        return response.data;
    } catch (error) {
        console.error(`There was an error`, error);
        return null;
    }
};