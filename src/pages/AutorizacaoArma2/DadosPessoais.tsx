import { Grid, FormLabel, OutlinedInput, styled } from "@mui/material"
import { useFormContext } from "react-hook-form"
import { apiRequest } from "../../services/api/apiRequestService";

const FormGrid = styled(Grid)(() => ({
  display: "flex",
  flexDirection: "column",
}));

export default function DadosPessoais() {
  const { register, handleSubmit } = useFormContext()

  const handleSave = async (formData: any) => {
    try {

      const uuid = "5545";
      const tipo = "dadosPessoais";

      const data = {
        tipo,
        data: {
          uuid,
          ...formData,
        },
      };
      const response = await apiRequest(data);
      console.log('entrou')
      console.log("Dados salvos com sucesso:", response);
    } catch (error) {
      console.error("Erro ao salvar os dados:", error);
    }
  };

  const baseInputProps = {
    onBlur: handleSubmit(handleSave)
  }

  return (
    <Grid container spacing={3} marginTop={"5px"} id="dados-pessoais-form">
      <FormGrid item xs={12}>
        <FormLabel htmlFor="nomeCompleto" required>
          Nome completo
        </FormLabel>
        <OutlinedInput
          placeholder="Seu nome completo"
          type="text"
          autoComplete="nomeCompleto"
          {...register("nomeCompleto", { required: true, ...baseInputProps })}
          {...register("nomeCompleto", { required: true })}
          sx={{ backgroundColor: 'white' }} // Fundo branco
        />
      </FormGrid>
      <FormGrid item xs={12} md={6}>
        <FormLabel htmlFor="cpf" required>
          CPF
        </FormLabel>
        <OutlinedInput
          type="text"
          placeholder="000.000.000-00"
          autoComplete="cpf"
          required
          {...register("cpf", { required: true, ...baseInputProps })}

        />
      </FormGrid>
      <FormGrid item xs={12} md={6}>
        <FormLabel htmlFor="rg" required>
          RG
        </FormLabel>
        <OutlinedInput
          type="text"
          placeholder="00.000.000-0"
          autoComplete="rg"
          required
          {...register("rg", { required: true, ...baseInputProps })}
        />
      </FormGrid>
      <FormGrid item xs={12} md={6}>
        <FormLabel htmlFor="nacionalidade" required>
          Nacionalidade
        </FormLabel>
        <OutlinedInput
          type="text"
          placeholder="Brasileiro(a)"
          autoComplete="nacionalidade"
          required
          {...register("nacionalidade", { required: true, ...baseInputProps })}
        />
      </FormGrid>
      <FormGrid item xs={12} md={6}>
        <FormLabel htmlFor="dataNascimento" required>
          Data de Nascimento
        </FormLabel>
        <OutlinedInput
          type="date"
          placeholder="DD/MM/AAAA"
          autoComplete="dataNascimento"
          required
          {...register("dataNascimento", { required: true, ...baseInputProps })}
        />
      </FormGrid>
      <FormGrid item xs={12}>
        <FormLabel htmlFor="nomeMae" required>
          Nome Completo da Mãe
        </FormLabel>
        <OutlinedInput
          type="text"
          placeholder="Nome Completo da Mãe"
          autoComplete="nomeMae"
          required
          {...register("nomeMae", { required: true, ...baseInputProps })}
        />
      </FormGrid>
      <FormGrid item xs={12}>
        <FormLabel htmlFor="father-name" required>
          Nome Completo do Pai
        </FormLabel>
        <OutlinedInput
          type="text"
          placeholder="Nome Completo do Pai"
          autoComplete="nomePai"
          required
          {...register("nomePai", { required: true, ...baseInputProps })}
        />
      </FormGrid>
    </Grid>
  )
}