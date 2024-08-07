import axios from 'axios';

export const apiRequest = async (endpoint: string, method: 'GET' | 'POST', params?: any, data?: any) => {
  try {
    const config = {
      method: method,
      url: `http://localhost:3010/processos/${endpoint}`,
      headers: { 'Content-Type': 'application/json' },
      params: params || {},
      data: data || {}
    };
    const response = await axios(config);
    return response.data;
  } catch (error) {
    console.error(`There was an error with the ${method} request to ${endpoint}:`, error);
    return null;
  }
};