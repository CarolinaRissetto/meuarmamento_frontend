import { apiRequest } from '../api/apiRequestService';
import { verificarCamposPreenchidos } from './utils/formValidator';
import { buscarDocumentosPolling } from '../../pages/autorizacaoArma/sections/utils/BuscarDocumentosPolling';

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

export const gerarPdfsTemplates = async (
    formData: { [key: string]: any },
    uuid: string | null,
    setPdfUrls: React.Dispatch<React.SetStateAction<{ [key: string]: string | null }>>,
    setFormData: React.Dispatch<React.SetStateAction<{ [key: string]: any }>>
) => {

    if (!verificarCamposPreenchidos(formData, camposNecessarios)) {
        console.log("Campos obrigatórios não preenchidos.");
        return;
    }

    // Desestruture o objeto 'endereco' do formData
    const { endereco = {}, ...outrosDados } = formData;

    // Combine os dados do endereço com os demais campos
    const formDataCombinado = {
        ...outrosDados,
        ...endereco,  // Aqui você espalha as chaves do endereço no nível superior
        uuid
    };

    console.log("GERANDO PDFS BASICOS");

    try {
        const hoje = new Date();
        const dia = hoje.getDate().toString().padStart(2, '0');
        const mes = (hoje.getMonth() + 1).toString().padStart(2, '0'); // Meses são indexados de 0 a 11
        const ano = hoje.getFullYear();
        const dataAtual = `${formDataCombinado.cidade}, ${dia} de ${mes} de ${ano}`;

        const formDataComData = {
            ...formDataCombinado,
            local_data: dataAtual
        };

        await apiRequest({
            tipo: "gerarPdfsBasicos",
            data: formDataComData,
        });

        buscarDocumentosPolling(setFormData, setPdfUrls, uuid);

    } catch (error) {
        console.error("Erro ao chamar a API de geração de PDF:", error);
    }
};
