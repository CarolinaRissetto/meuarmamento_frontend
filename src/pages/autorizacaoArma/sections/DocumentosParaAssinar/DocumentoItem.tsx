import React from "react";
import {
  ListItem,
  ListItemIcon,
  ListItemText,
  Tooltip,
  Link,
  Typography,
  CircularProgress,
} from "@mui/material";
import DownloadIcon from "@mui/icons-material/Download";
import WarningIcon from "@mui/icons-material/Warning";
import HourglassEmptyIcon from "@mui/icons-material/HourglassBottom";
import FileDownloadOffIcon from "@mui/icons-material/FileDownloadOff";
import { DocumentoProcesso } from "../../domain/ProcessoAggregate"; 
import { StatusDocumento } from "../../domain/enums/StatusDocumento";

interface DocumentoItemProps {
  doc: DocumentoProcesso;
  fullView: boolean;
  onDownloadClick: (e: React.MouseEvent<HTMLAnchorElement>, url: string | null) => void;
  traduzirNomeArquivo: (arquivo: string) => string;
}

export const DocumentoItem: React.FC<DocumentoItemProps> = ({ doc, fullView, onDownloadClick, traduzirNomeArquivo }) => {
  const isDownloadable = doc.urlDocumentoGerado && doc.status === "Gerado";

  const renderIcon = () => {
    switch (doc.status) {
      case StatusDocumento.GERANDO:
      case StatusDocumento.PRONTO_PARA_GERAR:
        return <CircularProgress size={24} />;
      case StatusDocumento.PENDENTE:
        return <HourglassEmptyIcon />;
      case StatusDocumento.GERADO:
        return <DownloadIcon sx={{ color: "#1976d2" }} />;
      case StatusDocumento.ERRO:
        return (
          <Tooltip title="Ocorreu um erro ao gerar o arquivo :(" arrow>
            <WarningIcon sx={{ color: "#fe9513" }} />
          </Tooltip>
        );
      default:
        return <FileDownloadOffIcon sx={{ color: "#FF9800" }} />;
    }
  };

  return (
    <ListItem sx={{ pt: 0, pb: 0, pl: fullView ? 2 : 0 }} key={doc.id}>
      {fullView && <ListItemIcon sx={{ minWidth: 30 }}>{renderIcon()}</ListItemIcon>}
      {isDownloadable ? (
        <Link
          href={doc.urlDocumentoGerado || undefined}
          target="_blank"
          underline="hover"
          sx={{ color: "#1976d2", cursor: "pointer" }}
          onClick={(e) => onDownloadClick(e, doc.urlDocumentoGerado ?? null)}
        >
          <ListItemText sx={{ marginTop: "3px", marginBottom: "3px" }}>
            <Typography sx={{ fontSize: fullView ? "1rem" : "0.85rem" }}>
              {traduzirNomeArquivo(doc.id || "")}
            </Typography>
          </ListItemText>
        </Link>
      ) : (
        <ListItemText sx={{ marginTop: "3px", marginBottom: "3px" }}>
          <Typography sx={{ fontSize: fullView ? "1rem" : "0.85rem" }}>
            {traduzirNomeArquivo(doc.id || "")}
          </Typography>
        </ListItemText>
      )}
    </ListItem>
  );
};

export default React.memo(DocumentoItem);
