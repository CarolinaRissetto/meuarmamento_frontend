export const traducaoDocumentosSisgcorp: Record<string, string> = {
  declaracaoIdoneidade: "8. Declaração não estar RESP INQ POL ou PROC CRIMINAL",
  segurancaAcervo: "12. Declaração de Segurança do Acervo",
  certidaoFederal: "2. Certidão de antecedente Criminal Justiça Federal",
  certidaoEstadual:
    "5. Certidão de antecedente Criminal Justiça Estadual local domicílio últimos cinco anos",
  certidaoMilitar: "6. Certidão de antecedente Criminal Justiça Militar",
};

export const traduzirNomeArquivo = (arquivo: string): string => {
  return traducaoDocumentosSisgcorp[arquivo] || arquivo;
};
