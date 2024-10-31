import React, { useState, MouseEvent } from "react";
import Link from "@mui/material/Link";
import DownloadIcon from "@mui/icons-material/Download";
import WarningIcon from "@mui/icons-material/Warning";
import HourglassEmptyIcon from "@mui/icons-material/HourglassBottom";
import FileDownloadOffIcon from "@mui/icons-material/FileDownloadOff";
import {
  CircularProgress,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Tooltip,
  Typography,
} from "@mui/material";
import { ModalColetaLead } from "../../../components/modalLead/ModalColetaLead";
import { apiRequest } from "../../../services/api/apiRequestService";
import { LeadData } from "../domain/LeadData";

const translations: { [key: string]: string } = {
  declaracaoIdoneidade: "8. Declaração não estar RESP INQ POL ou PROC CRIMINAL",
  segurancaAcervo: "12. Declaração de Segurança do Acervo",
  certidaoJusticaFederal: "2. Certidão de antecedente Criminal Justiça Federal",
  certidaoJusticaEstadual:
    "5. Certidão de antecedente Criminal Justiça Estadual local domicílio últimos cinco anos",
  certidaoJusticaMilitar: "6. Certidão de antecedente Criminal Justiça Militar",
};

function translateFileNames(arquivo: string): string {
  return translations[arquivo] || arquivo;
}

export default function DocumentosParaAssinar({
  urls: documentos = {},
  fullView = true,
}: {
  urls: { [key: string]: { url: string | null; status: string | null } };
  fullView?: boolean;
}) {
  const missingFiles = Object.keys(translations).filter(
    (key) => !documentos[key]
  );

  const [modalOpen, setModalOpen] = useState(false);
  const [pendingDownload, setPendingDownload] = useState<string | null>(null);

  const leadData = localStorage.getItem("leadData");

  const handleDownloadClick = (
    e: MouseEvent<HTMLAnchorElement>,
    url: string | null
  ) => {
    if (!leadData && url) {
      e.preventDefault();
      setPendingDownload(url);
      setModalOpen(true);
    }
  };

  const handleModalClose = () => {
    setModalOpen(false);
    setPendingDownload(null);
  };

  const handleLeadSubmit = (data: LeadData) => {
    console.log("Dados do Lead:", data);

    localStorage.setItem("leadData", JSON.stringify(data));

    const uuid = localStorage.getItem("user-uuid");

    apiRequest({
      tipo: "salvarLead",
      data: {
        uuid,
        ...data,
      },
    });

    setModalOpen(false);

    if (pendingDownload) {
      window.open(pendingDownload, "_blank");
      setPendingDownload(null);
    }
  };

  return (
    <div>
      {fullView && (
        <div>
          {missingFiles.length !== 0 && (
            <div>
              <Typography sx={{ mt: 3, mb: 2 }} paragraph>
                Documentos que poderão ser gerados após a conclusão do
                preenchimento dos formulários acima:
              </Typography>

              <List>
                {missingFiles.map((arquivo) => (
                  <ListItem
                    key={arquivo + "empty"}
                    sx={{ pt: 0, pb: 0, pl: fullView ? 2 : 0 }}
                  >
                    {fullView && (
                      <ListItemIcon sx={{ minWidth: 30 }}>
                        <Tooltip
                          title={
                            arquivo === "certidaoJusticaEstadual"
                              ? "Esse documento ainda não está disponível, estamos trabalhando nele"
                              : "Preencha o formulário acima para que a automação possa ser iniciada"
                          } arrow
                        >
                          <FileDownloadOffIcon />
                        </Tooltip>
                      </ListItemIcon>
                    )}
                    <ListItemText sx={{ marginTop: "3px", marginBottom: "3px" }}>
                      <Typography
                        sx={{ fontSize: fullView ? "1rem" : "0.85rem" }}
                      >
                        {translateFileNames(arquivo)}
                      </Typography>
                    </ListItemText>
                  </ListItem>
                ))}
              </List>
            </div>
          )}
          {missingFiles.length === 0 && (
            <div>
              <Typography sx={{ mt: 3, mb: 2 }} paragraph>
                Na sessão abaixo você pode baixar os documentos conforme eles
                ficam prontos. Esse processo geralmente leva apenas alguns
                segundos!
              </Typography>
              <Typography sx={{ mt: 3, mb: 2 }} paragraph>
                Baixe-os no seu computador e acesse o
                <Link
                  href="https://www.gov.br/pt-br/servicos/assinatura-eletronica"
                  sx={{ pl: 0.5, pr: 0.5 }}
                >
                  GOV.BR
                </Link>
                para realizar a assinatura digital para submetê-los no SisGCorp!
              </Typography>
            </div>
          )}
        </div>
      )}
      <List>
        {Object.keys(documentos)
          .reverse()
          .map((arquivo, index) => {
            return (
              <ListItem
                sx={{ pt: 0, pb: 0, pl: fullView ? 2 : 0 }}
                key={arquivo}
              >
                {fullView && (
                  <ListItemIcon sx={{ minWidth: 30 }}>
                    {(() => {
                      switch (documentos[arquivo].status) {
                        case "INICIADO":
                          return <CircularProgress size={24} />;
                        case "PENDENTE":
                          return <HourglassEmptyIcon />;
                        case "CONCLUIDO":
                          return <DownloadIcon sx={{ color: "#1976d2" }} />;
                        case "ERRO":
                          return (
                            <Tooltip
                              title="Ocorreu um erro ao gerar o arquivo :("
                              arrow
                            >
                              <WarningIcon sx={{ color: "#fe9513" }} />
                            </Tooltip>
                          );
                        default:
                          return (
                            <FileDownloadOffIcon sx={{ color: "#FF9800" }} />
                          );
                      }
                    })()}
                  </ListItemIcon>
                )}
                {documentos[arquivo].status === "CONCLUIDO" ? (
                  <Link
                    href={documentos[arquivo].url || undefined}
                    target="_blank"
                    underline="hover"
                    sx={{ color: "#1976d2", cursor: "pointer" }}
                    onClick={(e) =>
                      handleDownloadClick(e, documentos[arquivo].url)
                    }
                  >
                    <ListItemText sx={{ marginTop: "3px", marginBottom: "3px" }}>
                      <Typography
                        sx={{ fontSize: fullView ? "1rem" : "0.85rem" }}
                      >
                        {translateFileNames(arquivo)}
                      </Typography>
                    </ListItemText>
                  </Link>
                ) : (
                  <ListItemText sx={{ marginTop: "3px", marginBottom: "3px" }}>
                    <Typography
                      sx={{ fontSize: fullView ? "1rem" : "0.85rem" }}
                    >
                      {translateFileNames(arquivo)}
                    </Typography>
                  </ListItemText>
                )}
              </ListItem>
            );
          })}
      </List>
      <ModalColetaLead
        modalOpen={modalOpen}
        handleModalClose={handleModalClose}
        onSubmit={handleLeadSubmit}
      />
    </div>
  );
}
