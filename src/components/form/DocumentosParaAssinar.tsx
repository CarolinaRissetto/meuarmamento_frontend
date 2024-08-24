import React from 'react';
import Grid from "@mui/material/Grid";
import SectionHeader from "./Cabecalho";
import Link from "@mui/material/Link";
import IconButton from "@mui/material/IconButton";
import DownloadIcon from "@mui/icons-material/Download";

export default function DocumentosParaAssinar({ urls }: { urls: { [key: string]: string | null } }) {
    return (
        <Grid item xs={12}>
            <SectionHeader title="Documentos Aguardando Assinatura" />

            {Object.keys(urls).map((urlArquivo, index) => (
                    <Grid container alignItems="center" sx={{ mt: 2 }}>
                    <Grid item>
                        <Link href={urlArquivo} target="_blank" rel="noopener noreferrer" underline="hover">
                            Segurança do Acervo
                        </Link>
                    </Grid>
                    <Grid item>
                        <IconButton href={urlArquivo} target="_blank" rel="noopener noreferrer" download>
                            <DownloadIcon />
                        </IconButton>
                    </Grid>
                </Grid>
            ))}
        </Grid>
    );
}
