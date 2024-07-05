import * as React from "react";
import FormLabel from "@mui/material/FormLabel";
import Grid from "@mui/material/Grid";
import OutlinedInput from "@mui/material/OutlinedInput";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import { styled } from "@mui/system";
// import SectionHeader from "./Cabeçalho";
// import { Button } from "@mui/material";
import { useState } from "react";

const FormGrid = styled(Grid)(() => ({
    display: "flex",
    flexDirection: "column",
}));

const handleFileChange = (
    year: number,
    event: React.ChangeEvent<HTMLInputElement>,
    setFiles: React.Dispatch<React.SetStateAction<{ [key: number]: File | null }>>
) => {
    if (event.target.files && event.target.files.length > 0) {
        setFiles((prevFiles) => ({
            ...prevFiles,
            [year]: event.target.files![0],
        }));
    }
};

export default function AddressForm() {
    const currentYear = new Date().getFullYear();
    const years = Array.from({ length: 5 }, (_, i) => currentYear - i);
    const [files, setFiles] = useState<{ [key: number]: File | null }>({});

    return (
        <FormLabel component="legend">
            Morou no mesmo endereço nos últimos 5 anos?
        </FormLabel>
//     <Grid container spacing={3} marginTop={"5px"}>
//       <Grid item xs={12}>
//         <SectionHeader title="Endereço" />
//       </Grid>
//       <FormGrid item xs={12}>
//         <FormLabel component="legend">
//           Morou no mesmo endereço nos últimos 5 anos?
//         </FormLabel>
//         <RadioGroup
//           row
//           aria-label="same-address"
//           name="same-address"
//           defaultValue="yes"
//         >
//           <FormControlLabel value="yes" control={<Radio />} label="Sim" />
//           <FormControlLabel value="no" control={<Radio />} label="Não" />
//         </RadioGroup>
//       </FormGrid>
//       <FormGrid item xs={12} md={6}>
//         <FormLabel htmlFor="num-addresses" required>
//           Quantos endereços diferentes morou nos últimos 5 anos?
//         </FormLabel>
//         <OutlinedInput
//           id="num-addresses"
//           name="num-addresses"
//           type="number"
//           autoComplete="num-addresses"
//           required
//         />
//       </FormGrid>
//       <FormGrid item xs={12} md={6}>
//         <FormLabel htmlFor="cep" required style={{ marginTop: "22px" }}>
//           CEP
//         </FormLabel>
//         <OutlinedInput
//           id="cep"
//           name="cep"
//           type="text"
//           autoComplete="cep"
//           required
//         />
//       </FormGrid>
//       <FormGrid item xs={12}>
//         <FormLabel htmlFor="address" required>
//           Endereço
//         </FormLabel>
//         <OutlinedInput
//           id="address"
//           name="address"
//           type="text"
//           autoComplete="address"
//           required
//         />
//       </FormGrid>
//       <FormGrid item xs={12} md={2}>
//         <FormLabel htmlFor="number" required>
//           Nº
//         </FormLabel>
//         <OutlinedInput
//           id="number"
//           name="number"
//           type="text"
//           autoComplete="number"
//           required
//         />
//       </FormGrid>
//       <FormGrid item xs={12} md={4}>
//         <FormLabel htmlFor="complement" required>
//           Complemento
//         </FormLabel>
//         <OutlinedInput
//           id="complement"
//           name="complement"
//           type="text"
//           autoComplete="complement"
//           required
//         />
//       </FormGrid>
//       <FormGrid item xs={12} md={6}>
//         <FormLabel htmlFor="city" required>
//           Cidade
//         </FormLabel>
//         <OutlinedInput
//           id="city"
//           name="city"
//           type="text"
//           autoComplete="city"
//           required
//         />
//       </FormGrid>
//       <FormGrid item xs={12} md={6}>
//         <FormLabel htmlFor="neighborhood" required>
//           Bairro
//         </FormLabel>
//         <OutlinedInput
//           id="neighborhood"
//           name="neighborhood"
//           type="text"
//           autoComplete="neighborhood"
//           required
//         />
//       </FormGrid>
//       <FormGrid item xs={12} md={6}>
//         <FormLabel htmlFor="state" required>
//           UF
//         </FormLabel>
//         <OutlinedInput
//           id="state"
//           name="state"
//           type="text"
//           autoComplete="state"
//           required
//         />
//       </FormGrid>
//       {years.map((year) => (
//         <Grid item xs={12} md={6} key={year}>
//           <FormLabel htmlFor={comprovante-${year}} required>
//             {year}
//           </FormLabel>
//           <Button variant="contained" component="label">
//             Upload o Comprovante de Residência de {year}
//             <input
//               type="file"
//               id={comprovante-${year}}
//               name={comprovante-${year}}
//               onChange={(e) => handleFileChange(year, e, setFiles)}
//               hidden
//             />
//           </Button>
//         </Grid>
//       ))}
//     </Grid>
   );
}