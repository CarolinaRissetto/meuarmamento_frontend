import { apiRequest } from '../api/apiRequestService';
import { verificarCamposPreenchidos } from './utils/formValidator';
import { buscarDocumentosPolling } from '../../pages/autorizacaoArma/sections/utils/BuscarDocumentosPolling';
import { ProcessoAggregate } from '../../pages/autorizacaoArma/domain/ProcessoAggregate';

const camposNecessarios = [
    'nomeCompleto',
    'dataNascimento',
    'nacionalidade',
    'cpf',
    'rua',
    'numero',
    'cep',
    'cidade',
    'bairro',
    'uf',
];

const meses = [
    'janeiro', 'fevereiro', 'março', 'abril', 'maio', 'junho',
    'julho', 'agosto', 'setembro', 'outubro', 'novembro', 'dezembro'
];

export const gerarPdfsTemplates = async (
    uuid: string | null,
    setPdfUrls: React.Dispatch<React.SetStateAction<{ [key: string]: { url: string | null; status: string | null } }>>,
    processoAggregate: ProcessoAggregate,
    setProcessoAggregate: React.Dispatch<React.SetStateAction<ProcessoAggregate>>
) => {
    const { endereco = {}, ...outrosDados } = processoAggregate;

    const formDataCombinado = {
        ...outrosDados,
        ...endereco,
        uuid,
    };

    if (!verificarCamposPreenchidos(formDataCombinado, camposNecessarios)) {
        console.log('Campos obrigatórios não preenchidos.');
        return;
    }

    buscarDocumentosPolling(setProcessoAggregate, setPdfUrls, uuid);

    console.log('GERANDO PDFS BASICOS');

    try {
        const hoje = new Date();
        const dia = hoje.getDate().toString().padStart(2, '0');
        const mes = meses[hoje.getMonth()]; 
        const ano = hoje.getFullYear();
        const dataAtual = `${formDataCombinado.cidade}, ${dia} de ${mes} de ${ano}`;

        const formDataComData = {
            ...formDataCombinado,
            local_data: dataAtual,
        };

        await apiRequest({
            tipo: 'gerarPdfsBasicos',
            data: formDataComData,
        });
    } catch (error) {
        console.error('Erro ao chamar a API de geração de PDF:', error);
    }
};
