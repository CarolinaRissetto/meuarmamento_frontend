import { gerarCertidaoJusticaEstadual } from "../../../../services/pdf/gerarCertidaoJusticaEstadual";
import { gerarCertidaoJusticaFederal } from "../../../../services/pdf/gerarCertidaoJusticaFederal";
import { gerarCertidaoJusticaMilitar } from "../../../../services/pdf/gerarCertidaoJusticaMilitar";

export const gerarCertidoes = async (formData: { [key: string]: any },
    setPdfUrls: React.Dispatch<React.SetStateAction<{ [key: string]: string | null }>>,
    uuid: string | null,
    setFormData: (data: any) => void
) => {

    try {
        const promises = [
            gerarCertidaoJusticaEstadual(formData, setFormData, setPdfUrls, uuid),
            gerarCertidaoJusticaMilitar(formData, setFormData, setPdfUrls, uuid),
            gerarCertidaoJusticaFederal(formData, setFormData, setPdfUrls, uuid),
        ];

        await Promise.all(promises);
    } catch (error) {
        console.error('Erro ao gerar múltiplos certificados:', error);
    }
}