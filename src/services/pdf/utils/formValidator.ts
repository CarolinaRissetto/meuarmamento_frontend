export const verificarCamposPreenchidos = (formData: { [key: string]: any }, camposNecessarios: string[]): boolean => {
    return camposNecessarios.every(campo => {
        let valor;

        if (campo in formData) {
            valor = formData[campo];
        } else if (campo in (formData.endereco || {})) {
            valor = formData.endereco[campo];
        }

        return valor !== undefined && valor !== null && valor !== '';
    });
};