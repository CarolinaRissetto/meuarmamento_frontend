import React, { createContext, useState, ReactNode } from 'react';
import { ProcessoAggregate } from '../../domain/ProcessoAggregate'; 
import { ComprovanteResidenciaEntity } from '../../domain/ComprovanteResidenciaEntity';

interface ProcessoContextProps {
    processoAggregate: ProcessoAggregate;
    setProcessoAggregate: React.Dispatch<React.SetStateAction<ProcessoAggregate>>;
    resetProcessoAggregate: () => void; // Função de reset
}


const currentYear = new Date().getFullYear();
const anos = Array.from({ length: 5 }, (_, i) => currentYear - i);

// Função para criar um comprovante de residência padrão
const createDefaultComprovante = (ano: number): ComprovanteResidenciaEntity => ({
    id: null,
    ano,
    arquivo: null,
    titular: null,
    dadosTitular: {
        nome: "",
        rg: "",
        cpf: "",
        endereco: {
            cep: "",
            rua: "",
            complemento: "",
            numero: "",
            bairro: "",
            cidade: "",
            uf: "",
        },
    },
});

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
    },
    documentos: [],
    comprovantesResidencia: anos.map(createDefaultComprovante), 
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
