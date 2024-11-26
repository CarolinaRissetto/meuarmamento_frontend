import React, { useState, MouseEvent, useMemo, useEffect, useCallback } from "react";
import {
  Button,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Tooltip,
  Typography,
  Link,
} from "@mui/material";
import FileDownloadOffIcon from "@mui/icons-material/FileDownloadOff";
import FolderZipIcon from '@mui/icons-material/FolderZip';
import JSZip from "jszip";
import { saveAs } from "file-saver";
import DocumentoItem from "./DocumentoItem";
import { traducaoDocumentosSisgcorp, traduzirNomeArquivo } from "./TraducaoDocumentosSisgcorp";
import { ModalColetaLead } from "../../../../components/modalLead/ModalColetaLead";
import { apiRequest } from "../../../../services/api/apiRequestService";
import { LeadData } from "../../domain/LeadData";
import { useProcesso } from "../context/useProcesso";
import { DocumentoProcesso } from "../../domain/ProcessoAggregate";

const NOME_PROCESSO = "AquisicaoArmasDeFogo";

export default function DocumentosParaAssinar({
  fullView = true,
  setActiveStep,
}: {
  fullView?: boolean;
  setActiveStep: React.Dispatch<React.SetStateAction<number>>;
}) {

  const { processoAggregate } = useProcesso();
  const [modalOpen, setModalOpen] = useState(false);
  const [downloadPendente, setDownloadPendente] = useState<string | null>(null);
  const [documentosProcessados, setDocumentosProcessados] = useState<DocumentoProcesso[]>([]);
  const [downloadPendenteZip, setDownloadPendenteZip] = useState(false);
  const [leadData, setLeadData] = useState<LeadData | null>(() => {
    const data = localStorage.getItem("leadData");
    return data ? JSON.parse(data) : null;
  });

  useEffect(() => {
    if (processoAggregate.documentos) {
      setDocumentosProcessados(processoAggregate.documentos);
    }
  }, [processoAggregate.documentos]);

  const nomesDocumentosRecebidos = documentosProcessados.map(doc => doc.id).filter((id): id is string => !!id);

  const missingFiles = Object.keys(traducaoDocumentosSisgcorp).filter(
    (key) => !nomesDocumentosRecebidos.includes(key)
  );

  const handleDownloadClick = (
    e: MouseEvent<HTMLAnchorElement>,
    url: string | null
  ) => {
    if (!leadData && url) {
      e.preventDefault();
      setDownloadPendente(url);
      setModalOpen(true);
    }
  };

  const handleModalClose = () => {
    setModalOpen(false);
    setDownloadPendente(null);
  };

  const handleEnviarLead = async (data: LeadData) => {
    console.log("Dados do Lead:", data);

    localStorage.setItem("leadData", JSON.stringify(data));
    setLeadData(data);

    await apiRequest({
      method: 'POST',
      endpoint: `/${processoAggregate.id}/lead`,
      data: data
    });

    setModalOpen(false);

    if (downloadPendente) {
      window.open(downloadPendente, "_blank");
      setDownloadPendente(null);
    }

    if (downloadPendenteZip) {
      baixarTodosDocumentosZip();
      setDownloadPendenteZip(false);
    }
  };

  const documentosValidos = documentosProcessados.filter(
    (doc) => doc.status === "Gerado" && doc.urlDocumentoGerado
  );

  const handleBaixarTodosDocumentos = () => {
    if (!leadData) {
      setDownloadPendenteZip(true);
      setModalOpen(true);
    } else {
      baixarTodosDocumentosZip();
    }
  };

  const baixarTodosDocumentosZip = async () => {

    if (documentosValidos.length === 0) {
      alert("Nenhum documento disponível para download.");
      return;
    }

    const zip = new JSZip();
    const nomeCliente = leadData?.nome.replace(/\s+/g, "");
    const zipFileName = `${nomeCliente}_${NOME_PROCESSO}.zip`;

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
          {missingFiles.length > 0 ? (
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
                        {traduzirNomeArquivo(arquivo)}
                      </Typography>
                    </ListItemText>
                  </ListItem>
                ))}
              </List>
            </div>
          ) : (
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
          .slice()
          .reverse()
          .map((doc) => (
            <DocumentoItem
              key={doc.id}
              doc={doc}
              fullView={fullView}
              onDownloadClick={handleDownloadClick}
              traduzirNomeArquivo={traduzirNomeArquivo}
            />
          ))}
      </List>
      {fullView && (
        <Button
          variant="contained"
          startIcon={<FolderZipIcon />}
          onClick={handleBaixarTodosDocumentos}
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
        onSubmit={handleEnviarLead}
      />
    </div>
  );
}