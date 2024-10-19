export interface DadosPessoaisEntity {
    nomeCompleto?: string;
    cpf?: string;
    rg?: string;
    nacionalidade?: string;
    dataNascimento?: string;
    nomeMae?: string;
    nomePai?: string;
}

export const isDadosPessoaisFilled = (data: DadosPessoaisEntity): boolean => {
    return Object.values(data).every((value) => value && value.trim() !== "");
};