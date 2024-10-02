export const formatarDataParaBrasileiro = (data: string): string  => {
    const [ano, dia, mes] = data.split("-");

    return `${dia}-${mes}-${ano}`;
};
