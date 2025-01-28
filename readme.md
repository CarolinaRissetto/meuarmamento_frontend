# Projeto Meu Armamento

Um sistema para gerenciamento e registro de certificados e emissão de autorizações CAC (Colecionador, Atirador e Caçador), incluindo formulários de registro, armazenamento de dados.

## 🚀 Começando

Essas instruções permitirão que você obtenha uma cópia do projeto em operação na sua máquina local para fins de desenvolvimento e teste.

### 📋 Pré-requisitos

De que coisas você precisa para instalar o software e como instalá-lo?

- Node.js e npm (Node Package Manager)

Para instalar o Node.js e npm, siga as instruções no site oficial: https://nodejs.org/


### 🔧 Instalação

Aqui você tem os passos necessários para ter um ambiente de desenvolvimento em execução.

Clone o repositório do projeto: 
```sh
https://github.com/CarolinaRissetto/meuarmamento_frontend
```
Navegue até o diretório do projeto:
```sh
cd meuarmamento_frontend
```
Instale as dependências:
```sh
npm install
```
Inicie o servidor de desenvolvimento:
```sh
npm start
```

Percisa ser criado o arquivo .env.development.local para testar localmente, conforme o exemplo do arquivo .env.exemple do projeto.

## 📦 Implantação

O projeto front-end está configurado para ser implantado na AWS utilizando S3 e CloudFront.

A implantação do projeto acontece automaticamente após passar no build, (verifique os erros do eslint antes de fazer merge).

## 🛠️ Construído com

* [React](https://reactjs.org/) - Biblioteca JavaScript para construção de interfaces de usuário
* [TypeScript](https://www.typescriptlang.org/) - Superset do JavaScript que adiciona tipagem estática
* [Material-UI](https://material-ui.com/) - Biblioteca de componentes React
* [AWS S3](https://aws.amazon.com/s3/) - Armazenamento de objetos
* [AWS CloudFront](https://aws.amazon.com/cloudfront/) - Rede de distribuição de conteúdo
* [AWS API Gateway](https://aws.amazon.com/api-gateway/) - Serviço para criar, publicar, manter, monitorar e proteger APIs
* [AWS Lambda](https://aws.amazon.com/lambda/) - Serviço de computação serverless
