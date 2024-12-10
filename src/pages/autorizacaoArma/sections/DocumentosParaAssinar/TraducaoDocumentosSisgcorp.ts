export const traducaoDocumentosSisgcorp: Record<string, string> = {
  declaracaoIdoneidade: "Declaração não estar RESP INQ POL ou PROC CRIMINAL",
  segurancaAcervo: "Declaração de Segurança do Acervo",
  certidaoFederal: "Certidão de antecedente Criminal Justiça Federal",
  certidaoEstadual:
    "Certidão de antecedente Criminal Justiça Estadual local domicílio últimos cinco anos",
  certidaoMilitar: "Certidão de antecedente Criminal Justiça Militar",
  comprovanteResidencia: "Comprovante de residência fixa referente aos locais de domicílio dos últimos cinco anos"
};

export const traduzirNomeArquivo = (arquivo: string): string => {
  return traducaoDocumentosSisgcorp[arquivo] || arquivo;
};
