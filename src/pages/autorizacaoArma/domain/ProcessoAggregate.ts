import { EnderecoEntity } from "./EnderecoEntity";

export interface ProcessoAggregate {
    nomeCompleto?: string;
    cpf?: string;
    rg?: string;
    nacionalidade?: string;
    dataNascimento?: string;
    nomeMae?: string;
    nomePai?: string;

    endereco: EnderecoEntity;
    
    //ultimosEnderecosComprovante: List<EnderecoComprovanteEntity>;
    
    //documentos: List<Documentos>;
}

export const isDadosPessoaisFilled = (data: ProcessoAggregate): boolean => {
    return (
        data.nomeCompleto != null && data.nomeCompleto.trim() !== '' &&
        data.cpf != null && data.cpf.trim() !== '' &&
        data.rg != null && data.rg.trim() !== '' &&
        data.nacionalidade != null && data.nacionalidade.trim() !== '' &&
        data.dataNascimento != null && data.dataNascimento.trim() !== '' &&
        data.nomeMae != null && data.nomeMae.trim() !== '' &&
        data.nomePai != null && data.nomePai.trim() !== ''
    );  
};

export const isEnderecoFilled = (data: EnderecoEntity): boolean => {
    return Object.values(data).every(value => value != null && value.trim() !== '');
};