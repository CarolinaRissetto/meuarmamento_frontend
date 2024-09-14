import React from "react"
import { useForm, FormProvider } from "react-hook-form"
import DadosPessoais from "../AutorizacaoArma2/DadosPessoais";
import useLocalStorageClient from "../../hooks/useLocalStorageClient";

export default function AutorizacaoArma2() {

  // const { setFormData } = useLocalStorageClient();

  const uuid = "5545";

  // const buscarDados = useCallback(async (uuid: string) => {
  //   const response = await apiRequest({
  //     tipo: "buscaDados",
  //     data: {
  //       uuid,
  //     },
  //   });

  //   if (response) {
  //     try {
  //       const parsedData = typeof response === "string" ? JSON.parse(response) : response;
  //       console.log(parsedData);
  //       setFormData(parsedData);
  //       setPdfUrls(parsedData.documentos);
  //       localStorage.setItem(`form-data-${uuid}`, JSON.stringify(parsedData));

  //       const initialActiveStep = parsedData.documentos && Object.keys(parsedData.documentos).length > 0 ? 2 : 0;
  //       setActiveStep(initialActiveStep);

  //     } catch (error) {
  //       console.error("Erro ao fazer o parse do JSON:", error);
  //       return;
  //     }
  //   }
  // }, []);

  // const buscarDadosEAtualizarEstado = async () => {
  //   const urlParams = new URLSearchParams(location.search);
  //   const urlUuid = urlParams.get("uuid");
  //   const storedUuid = localStorage.getItem("user-uuid");

  //   if (urlUuid && urlUuid !== storedUuid) {
  //     setUuid(urlUuid);
  //     await buscarDados(urlUuid);
  //     atualizaUrlELocalStorage(urlUuid);
  //   } else if (storedUuid) {
  //     setUuid(storedUuid);
  //     await buscarDados(storedUuid);
  //     atualizaUrlELocalStorage(storedUuid);
  //   } else {
  //     const newUuid = nanoid(6);
  //     setUuid(newUuid);
  //     await buscarDados(newUuid);
  //     atualizaUrlELocalStorage(newUuid);
  //   }
  // };


  const methods = useForm()

  const onSubmit = () => console.log("Formulário enviado!");

  return (
    <FormProvider {...methods}>
      <form onSubmit={methods.handleSubmit(onSubmit)}>
        <DadosPessoais />
        {/* <Endereco /> */}
        <input type="submit" />
      </form>
    </FormProvider>
  )
}

