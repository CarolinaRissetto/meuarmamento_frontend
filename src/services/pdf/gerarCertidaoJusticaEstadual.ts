import { apiRequest } from '../api/apiRequestService';
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
    'uf',
    'sexo',
    'estadoCivil'
];

export const gerarCertidaoJusticaEstadual = async (
    uuid: string | null,
    setPdfUrls: React.Dispatch<React.SetStateAction<{ [key: string]: { url: string | null; status: string | null; }; }>>,    
    processoAggregate: ProcessoAggregate,
    setProcessoAggregate: React.Dispatch<React.SetStateAction<ProcessoAggregate>>,
) => {

    if (!verificarCamposPreenchidos(processoAggregate, camposNecessarios)) {
        console.log("Campos obrigatórios não preenchidos.");
        return;
    }

    setPdfUrls((prevPdfUrls) => ({
        ...prevPdfUrls,
        certidaoJusticaEstadual: { url: null, status: 'INICIADO' },
    }));

    buscarDocumentosPolling(setProcessoAggregate, setPdfUrls, uuid);    

    const formDataCombinado = {
        ...processoAggregate,
        dataNascimento: processoAggregate.dataNascimento,
        sexo: processoAggregate.sexo,
        estadoCivil: processoAggregate.estadoCivil,
        rua: processoAggregate.endereco.rua,
        numero: processoAggregate.endereco.numero,
        cidade: processoAggregate.endereco.cidade,
        uf: processoAggregate.endereco.uf,
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