export const formatarDataParaBrasileiro = (data: string): string  => {
    const [ano, mes, dia] = data.split("-");

    return `${dia}-${mes}-${ano}`;
};
