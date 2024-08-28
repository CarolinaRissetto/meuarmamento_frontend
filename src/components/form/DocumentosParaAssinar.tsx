import React from "react";
import Link from "@mui/material/Link";
import DownloadIcon from "@mui/icons-material/Download";
import HourglassBottomIcon from "@mui/icons-material/HourglassBottom";
import {
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Typography,
} from "@mui/material";

const translations: { [key: string]: string } = {
  declaracaoIdoneidade: "8. Declaração não estar RESP INQ POL ou PROC CRIMINAL",
  segurancaAcervo: "12. Declaração de Segurança do Acervo",
};

function translateFileNames(arquivo: string): string {
  return translations[arquivo] || arquivo;
}
export default function DocumentosParaAssinar({
  urls = {},
  fullView = true,
}: {
  urls: { [key: string]: string | null };
  fullView?: boolean;
}) {
  const missingFiles = Object.keys(translations).filter((key) => !urls[key]);
  const hasFiles = Object.keys(urls).length > 0;

  return (
    <div>
      {fullView && (
        <div>
          {missingFiles.length > 0 && (
            <Typography sx={{ mt: 3, mb: 2 }} paragraph>
              Documentos que poderão ser gerados após a conclusão do
              preenchimento dos formulários acima:
            </Typography>
          )}

          <List>
            {missingFiles.map((arquivo) => (
              <ListItem
                key={arquivo + "empty"}
                sx={{ pt: 0, pb: 0, pl: fullView ? 2 : 0 }}
              >
                {fullView && (
                  <ListItemIcon sx={{ minWidth: 30 }}>
                    <HourglassBottomIcon />
                  </ListItemIcon>
                )}
                <ListItemText>
                  <Typography sx={{ fontSize: fullView ? "1rem" : "0.9rem" }}>
                    {translateFileNames(arquivo)}
                  </Typography>
                </ListItemText>
              </ListItem>
            ))}
          </List>

          {hasFiles && (
            <Typography variant="h6" sx={{ mt: 3, mb: 0 }} paragraph>
              Documentos prontos:
            </Typography>
          )}
        </div>
      )}
      <List>
        {Object.keys(urls)
          .reverse()
          .map((arquivo, index) => {
            return (
              <ListItem
                sx={{ pt: 0, pb: 0, pl: fullView ? 2 : 0 }}
                key={urls[arquivo]!}
              >
                {fullView && (
                  <ListItemIcon sx={{ minWidth: 30 }}>
                    <DownloadIcon />
                  </ListItemIcon>
                )}
                <Link href={urls[arquivo]!} target="_blank" underline="hover">
                  <ListItemText>
                    <Typography sx={{ fontSize: fullView ? "1rem" : "0.85rem" }}>
                      {translateFileNames(arquivo)}
                    </Typography>
                  </ListItemText>
                </Link>
              </ListItem>
            );
          })}
      </List>

      {
        fullView && hasFiles && (
          <div>
            <Typography sx={{ mb: 5 }} paragraph>
              Após baixar, acesse o
              <Link
                href="https://www.gov.br/pt-br/servicos/assinatura-eletronica"
                sx={{ pl: 0.5, pr: 0.5 }}
              >
                GOV.BR
              </Link>
              para realizar a assinatura digital!
            </Typography>
          </div>
        )
      }
    </div >
  );
}
