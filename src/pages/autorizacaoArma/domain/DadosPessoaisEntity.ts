import { EstadoCivil } from "./enums/EstadoCivil";
import { Sexo } from "./enums/Sexo";

export interface DadosPessoaisEntity {
    nomeCompleto: string | null;
    cpf: string | null;
    rg: string | null;
    nacionalidade: string | null;
    dataNascimento: string | null;
    nomeMae: string | null;
    nomePai: string | null;
    sexo: Sexo | null;
    estadoCivil: EstadoCivil | null;
}
