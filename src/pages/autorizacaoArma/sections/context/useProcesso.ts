import { useContext } from 'react';
import { ProcessoContext } from './ProcessoContext';

export const useProcesso = () => {
    const context = useContext(ProcessoContext);
    if (!context) {
        throw new Error('useProcesso deve ser usado dentro de um ProcessoProvider');
    }
    return context;
};
