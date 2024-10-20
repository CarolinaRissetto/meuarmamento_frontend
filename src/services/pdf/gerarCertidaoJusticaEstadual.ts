import { apiRequest } from '../api/apiRequestService';
import { formatarDataParaBrasileiro } from './utils/formUtils';
import { verificarCamposPreenchidos } from './utils/formValidator';
import { buscarDocumentosPolling } from '../../pages/autorizacaoArma/sections/utils/BuscarDocumentosPolling';
import { ProcessoAggregate } from '../../pages/autorizacaoArma/domain/ProcessoAggregate';

const camposNecessarios = [
    'nomeCompleto',
    'nomeMae',
    'nomePai',
    'cpf',
    'dataNascimento',
    'rg',
    'rua',
    'numero',
    'cidade',
    'bairro',
    'uf'
];

export const gerarCertidaoJusticaEstadual = async (
    uuid: string | null,
    setPdfUrls: React.Dispatch<React.SetStateAction<{ [key: string]: { url: string | null; status: string | null; }; }>>,    
    processoAggregate: ProcessoAggregate,
    setProcessoAggregate: React.Dispatch<React.SetStateAction<ProcessoAggregate>>,
) => {
    const sexo = "F";
    const estadoCivil = "1";

    if (!verificarCamposPreenchidos(processoAggregate, camposNecessarios)) {
        console.log("Campos obrigatórios não preenchidos.");
        return;
    }

    setPdfUrls((prevPdfUrls) => ({
        ...prevPdfUrls,
        certidaoJusticaEstadual: { url: null, status: 'INICIADO' },
    }));

    buscarDocumentosPolling(setProcessoAggregate, setPdfUrls, uuid);
    
    //TODO: retirar essa lógica de montagem da frase do frontend e levar pro backend
    const endereco = `${processoAggregate.endereco.rua}, ${processoAggregate.endereco.numero}, ${processoAggregate.endereco.cidade} - ${processoAggregate.endereco.uf}`;    

    const dataFormatada = formatarDataParaBrasileiro(processoAggregate.dataNascimento!).replaceAll("-", "/");

    const formDataCombinado = {
        ...processoAggregate,
        dataNascimento: dataFormatada,
        sexo,
        estadoCivil,
        endereco,
        uuid
    }

    console.log("Gerando certidão justiça federal");

    try {
        const response = await apiRequest({
            tipo: "gerarCertidaoEstadual",
            data: formDataCombinado
        });

        if (response.statusCode === 200) {
            setPdfUrls((prevUrls) => ({
                ...prevUrls,
                certidaoJusticaEstadual: response.body || null,
            }));

        } else {
            console.error('Erro ao gerar certidão estadual: resposta inesperada do servidor.');
            throw new Error('Falha ao gerar certidão. Por favor, tente novamente mais tarde.');
        }

    } catch (error) {
        console.error("Erro ao gerar pdf federal:", error);
    }
};