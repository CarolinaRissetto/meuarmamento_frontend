export const validarStepper = (formData: Record<string, any>): number => {
    const dadosPessoaisPreenchidos =
        formData.nomeCompleto &&
        formData.cpf &&
        formData.rg &&
        formData.nacionalidade &&
        formData.dataNascimento &&
        formData.nomeMae &&
        formData.nomePai;

    const enderecoPreenchido =
        formData.endereco &&
        formData.endereco.cep &&
        formData.endereco.rua &&
        formData.endereco.numero &&
        formData.endereco.cidade &&
        formData.endereco.bairro &&
        formData.endereco.uf;

    if (dadosPessoaisPreenchidos) {
        return enderecoPreenchido ? 2 : 1;
    }

    return 0; 
};
