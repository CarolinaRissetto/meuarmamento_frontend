import { DadosPessoaisEntity } from "./DadosPessoaisEntity";
import { EnderecoEntity } from "./EnderecoEntity";

export interface ProcessoAggregate {
    dadosPessoais: DadosPessoaisEntity;
    endereco: EnderecoEntity;
    //ultimosEnderecosComprovante: List<EnderecoComprovanteEntity>;
    //documentos: List<Documentos>;
}