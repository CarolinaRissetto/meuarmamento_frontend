import { EnderecoEntity } from "./EnderecoEntity";
import { DadosPessoaisEntity } from "./DadosPessoaisEntity";
import { ComprovanteResidenciaEntity } from "./ComprovanteResidenciaEntity";

export interface DocumentoProcesso {
    id: string | null;
    nome: string | null;
    status?: string | null;
    urlDocumentoGerado?: string | null;
}

export interface ProcessoAggregate {
    id: string | null;
    dadosPessoais: DadosPessoaisEntity;
    endereco: EnderecoEntity;
    documentos: DocumentoProcesso[];
    dataCriacao: string | null;
    dataAlteracao: string | null;
    comprovantesResidencia: ComprovanteResidenciaEntity[];
}

export const isDadosPessoaisFilled = (data: DadosPessoaisEntity): boolean => {
    return (
        data.nomeCompleto !== null && data.nomeCompleto.trim() !== '' &&
        data.cpf !== null && data.cpf.trim() !== '' &&
        data.rg !== null && data.rg.trim() !== '' &&
        data.nacionalidade !== null && data.nacionalidade.trim() !== '' &&
        data.dataNascimento !== null &&
        data.nomeMae !== null && data.nomeMae.trim() !== '' &&
        data.nomePai !== null && data.nomePai.trim() !== '' &&
        data.sexo !== null &&
        data.estadoCivil !== null
    );
};

export const isEnderecoFilled = (data: EnderecoEntity): boolean => {
    return (
        data.cep !== null && data.cep.trim() !== '' &&
        data.rua !== null && data.rua.trim() !== '' &&
        data.numero !== null && data.numero.trim() !== '' &&
        data.cidade !== null && data.cidade.trim() !== '' &&
        data.bairro !== null && data.bairro.trim() !== '' &&
        data.uf !== null && data.uf.trim() !== ''
    );
};