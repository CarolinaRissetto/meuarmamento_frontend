import { gerarCertidaoJusticaEstadual } from "../../../../services/pdf/gerarCertidaoJusticaEstadual";
import { gerarCertidaoJusticaFederal } from "../../../../services/pdf/gerarCertidaoJusticaFederal";
import { gerarCertidaoJusticaMilitar } from "../../../../services/pdf/gerarCertidaoJusticaMilitar";

export const gerarCertidoes = async (formData: { [key: string]: any },
    setPdfUrls: (callback: (prevUrls: { [key: string]: string | null }) => { [key: string]: string | null }) => void,
    uuid: string | null) => {
    try {
        await gerarCertidaoJusticaEstadual(formData, setPdfUrls, uuid);
        await gerarCertidaoJusticaMilitar(formData, setPdfUrls, uuid);
        await gerarCertidaoJusticaFederal(formData, setPdfUrls, uuid);
    } catch (error) {
        console.error('Erro ao gerar múltiplos certificados:', error);
    }
}