import React, { useState, MouseEvent, useMemo, useEffect } from "react";
import Link from "@mui/material/Link";
import DownloadIcon from "@mui/icons-material/Download";
import WarningIcon from "@mui/icons-material/Warning";
import HourglassEmptyIcon from "@mui/icons-material/HourglassBottom";
import FileDownloadOffIcon from "@mui/icons-material/FileDownloadOff";
import {
  Button,
  CircularProgress,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Tooltip,
  Typography,
} from "@mui/material";
import { ModalColetaLead } from "../../../components/modalLead/ModalColetaLead";
// import { apiRequest } from "../../../services/api/apiRequestService";
import { LeadData } from "../domain/LeadData";
import JSZip from "jszip";
import { saveAs } from "file-saver";
import FolderZipIcon from '@mui/icons-material/FolderZip';
import { useProcesso } from "./context/useProcesso";
import { DocumentoProcesso } from "../domain/ProcessoAggregate";

const translations: { [key: string]: string } = {
  declaracaoIdoneidade: "8. Declaração não estar RESP INQ POL ou PROC CRIMINAL",
  segurancaAcervo: "12. Declaração de Segurança do Acervo",
  certidaoFederal: "2. Certidão de antecedente Criminal Justiça Federal",
  certidaoEstadual:
    "5. Certidão de antecedente Criminal Justiça Estadual local domicílio últimos cinco anos",
  certidaoMilitar: "6. Certidão de antecedente Criminal Justiça Militar",
};

function translateFileNames(arquivo: string): string {
  return translations[arquivo] || arquivo;
}

export default function DocumentosParaAssinar({
  fullView = true,
  setActiveStep,
}: {
  fullView?: boolean;
  setActiveStep: React.Dispatch<React.SetStateAction<number>>;
}) {

  const { processoAggregate } = useProcesso();
  const [modalOpen, setModalOpen] = useState(false);
  const [pendingDownload, setPendingDownload] = useState<string | null>(null);
  const [documentosProcessados, setDocumentosProcessados] = useState<DocumentoProcesso[]>([]);

  useEffect(() => {
    if (processoAggregate.documentos) {
      setDocumentosProcessados(processoAggregate.documentos);
    }
  }, [processoAggregate.documentos]);

  // const documentosProcessados = Array.from(processoAggregate.documentos || {});
  // const documentosProcesso: DocumentoProcesso[] = processoAggregate.documentosProcesso || [];

  const nomesDocumentosRecebidos = documentosProcessados.map(doc => doc.id).filter((id): id is string => !!id);

  const missingFiles = Object.keys(translations).filter(
    (key) => !nomesDocumentosRecebidos.includes(key)
  );

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

    // apiRequest({
    //   tipo: "salvarLead",
    //   data: {
    //     processoAggregate.id,
    //     ...data,
    //   },
    // });

    setModalOpen(false);

    if (pendingDownload) {
      window.open(pendingDownload, "_blank");
      setPendingDownload(null);
    }
  };

  const documentosValidos = documentosProcessados.filter(
    (doc) => doc.status === "Gerado" && doc.urlDocumentoGerado
  );

  const downloadAllDocuments = async () => {

    if (documentosValidos.length === 0) {
      alert("Nenhum documento disponível para download.");
      return;
    }

    const zip = new JSZip();
    const leadDataParsed = leadData ? JSON.parse(leadData) : { nome: "Cliente" };
    const nomeCliente = leadDataParsed.nome.replace(/\s+/g, "");
    const nomeProcesso = "AquisicaoArmasDeFogo";
    const zipFileName = `${nomeCliente}_${nomeProcesso}.zip`;

    await Promise.all(
      documentosProcessados.map(async (doc) => {
        if (doc.status === "Gerado" && doc.urlDocumentoGerado) {
          const response = await fetch(doc.urlDocumentoGerado);
          const blob = await response.blob();

          const nomeArquivo = doc.urlDocumentoGerado.split("/").pop()?.split("?")[0];

          if (nomeArquivo) {
            zip.file(nomeArquivo, blob);
          }
        }
      })
    );

    const zipBlob = await zip.generateAsync({ type: "blob" });
    saveAs(zipBlob, zipFileName);
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
                          title={"Preencha o formulário acima para que a automação possa ser iniciada"}
                          arrow
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
        {documentosProcessados
          .reverse()
          .map((doc) => {

            const isDownloadable = doc.urlDocumentoGerado && doc.status === "Gerado";

            return (
              <ListItem
                sx={{ pt: 0, pb: 0, pl: fullView ? 2 : 0 }}
                key={doc.id}
              >
                {fullView && (
                  <ListItemIcon sx={{ minWidth: 30 }}>
                    {(() => {
                      switch (doc.status) {
                        case "Gerando":
                          return <CircularProgress size={24} />;
                        case "ProntoParaGerar":
                          return <CircularProgress size={24} />;
                        case "Pendente":
                          return <HourglassEmptyIcon />;
                        case "Gerado":
                          return <DownloadIcon sx={{ color: "#1976d2" }} />;
                        case "Erro":
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
                {isDownloadable ? (
                  <Link
                    href={doc.urlDocumentoGerado || undefined}
                    target="_blank"
                    underline="hover"
                    sx={{ color: "#1976d2", cursor: "pointer" }}
                    onClick={(e) =>
                      handleDownloadClick(e, doc.urlDocumentoGerado ?? null)
                    }
                  >
                    <ListItemText sx={{ marginTop: "3px", marginBottom: "3px" }}>
                      <Typography
                        sx={{ fontSize: fullView ? "1rem" : "0.85rem" }}
                      >
                        {translateFileNames(doc.id || "")}
                      </Typography>
                    </ListItemText>
                  </Link>
                ) : (
                  <ListItemText sx={{ marginTop: "3px", marginBottom: "3px" }}>
                    <Typography
                      sx={{ fontSize: fullView ? "1rem" : "0.85rem" }}
                    >
                      {translateFileNames(doc.id || "")}
                    </Typography>
                  </ListItemText>
                )}
              </ListItem>
            );
          })}
      </List>
      {fullView && (
        <Button
          variant="contained"
          startIcon={<FolderZipIcon />}
          onClick={downloadAllDocuments}
          disabled={documentosValidos.length === 0}
          sx={{
            margin: "15px",
            padding: "10px 20px",
            minWidth: "250px",
          }}
        >
          Baixe todos documentos juntos
        </Button>
      )}
      <ModalColetaLead
        modalOpen={modalOpen}
        handleModalClose={handleModalClose}
        onSubmit={handleLeadSubmit}
      />
    </div>
  );
}
