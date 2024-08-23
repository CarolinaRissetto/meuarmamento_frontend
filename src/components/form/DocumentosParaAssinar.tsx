import React, { useState, useEffect } from 'react';
import Grid from "@mui/material/Grid";
import SectionHeader from "./Cabecalho";
import Link from "@mui/material/Link";
import IconButton from "@mui/material/IconButton";
import DownloadIcon from "@mui/icons-material/Download";

export default function DocumentosParaAssinar({ url }: { url: string | null }) {
    return (
        <Grid item xs={12}>
            <SectionHeader title="Documentos Aguardando Assinatura" />
            {url && (
                <Grid container alignItems="center" sx={{ mt: 2 }}>
                    <Grid item>
                        <Link href={url} target="_blank" rel="noopener noreferrer" underline="hover">
                            Segurança do Acervo
                        </Link>
                    </Grid>
                    <Grid item>
                        <IconButton href={url} target="_blank" rel="noopener noreferrer" download>
                            <DownloadIcon />
                        </IconButton>
                    </Grid>
                </Grid>
            )}
        </Grid>
    );
}
