import React, { createContext, useState, ReactNode } from 'react';
import { ProcessoAggregate } from '../../domain/ProcessoAggregate'; 

interface ProcessoContextProps {
    processoAggregate: ProcessoAggregate;
    setProcessoAggregate: React.Dispatch<React.SetStateAction<ProcessoAggregate>>;
    resetProcessoAggregate: () => void; // Função de reset
}

export const defaultProcesso: ProcessoAggregate = {
    id: null,
    dadosPessoais: {
        nomeCompleto: null,
        cpf: null,
        rg: null,
        nacionalidade: null,
        dataNascimento: null,
        nomeMae: null,
        nomePai: null,
        sexo: null,
        estadoCivil: null,
    },
    endereco: {
        cep: null,
        rua: null,
        complemento: null,
        numero: null,
        bairro: null,
        cidade: null,
        uf: null,
        quantosEnderecosMorou: null,
    },
    documentos: [],
    dataCriacao: null,
    dataAlteracao: null,
};

export const ProcessoContext = createContext<ProcessoContextProps>({
    processoAggregate: defaultProcesso,
    setProcessoAggregate: () => { },
    resetProcessoAggregate: () => { },
});

interface ProcessoProviderProps {
    children: ReactNode;
}

export const ProcessoProvider: React.FC<ProcessoProviderProps> = ({ children }) => {
    const [processoAggregate, setProcessoAggregate] = useState<ProcessoAggregate>(defaultProcesso);

    const resetProcessoAggregate = () => {
        setProcessoAggregate(defaultProcesso);
    };

    return (
        <ProcessoContext.Provider value={{ processoAggregate, setProcessoAggregate, resetProcessoAggregate }}>
            {children}
        </ProcessoContext.Provider>
    );
};
