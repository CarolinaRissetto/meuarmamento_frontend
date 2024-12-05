import { EnderecoEntity } from "./EnderecoEntity";

export interface ComprovanteResidenciaEntity {
    id: string | null;
    ano: number | null;
    arquivo: string| null; 
    titular: boolean | null;
    dadosTitular?: {
        nome: string | null;
        rg: string | null;
        cpf: string | null;
         endereco?: EnderecoEntity;
    };
}
