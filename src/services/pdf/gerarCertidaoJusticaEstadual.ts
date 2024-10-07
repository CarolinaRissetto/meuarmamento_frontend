import { apiRequest } from '../api/apiRequestService';
import { formatarDataParaBrasileiro } from './utils/formUtils';
import { verificarCamposPreenchidos } from './utils/formValidator';

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

export const gerarCertidaoJusticaEstadual = async (formData: { [key: string]: any },
    setPdfUrls: React.Dispatch<React.SetStateAction<{ [key: string]: string | null }>>,
    uuid: string | null) => {
    const sexo = "F";
    const estadoCivil = "1";

    if (!verificarCamposPreenchidos(formData, camposNecessarios)) {
        console.log("Campos obrigatórios não preenchidos.");
        return;
    }

    console.log(formData)
    const endereco = `${formData.endereco.rua}, ${formData.endereco.numero}, ${formData.endereco.cidade} - ${formData.endereco.uf}`;
    console.log(endereco)

    const dataFormatada = formatarDataParaBrasileiro(formData.dataNascimento).replaceAll("-", "/");

    const formDataCombinado = {
        ...formData,
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