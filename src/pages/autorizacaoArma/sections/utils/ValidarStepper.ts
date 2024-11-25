export const validarStepper = (formData: Record<string, any>): number => {
    const dadosPessoaisPreenchidos =
        formData.dadosPessoais.nomeCompleto &&
        formData.dadosPessoais.cpf &&
        formData.dadosPessoais.rg &&
        formData.dadosPessoais.nacionalidade &&
        formData.dadosPessoais.dataNascimento &&
        formData.dadosPessoais.nomeMae &&
        formData.dadosPessoais.nomePai &&
        formData.dadosPessoais.sexo &&
        formData.dadosPessoais.estadoCivil;

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
