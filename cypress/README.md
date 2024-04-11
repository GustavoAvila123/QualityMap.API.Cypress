# Automação API - Cypress
[![E2E library: Cypress](https://img.shields.io/badge/E2E%20Framework-Cypress-blue)](https://www.cypress.io/)

## Introdução
O Projeto foi construído utilizando a arquitetura padrão gerada pelo cypress, os testes se concentram dentro da pasta e2e/integracao, e contemplam todos os cenários solicitados pelo desafio, foi utilizado gerador numerico, para gerar randomicamente a massa de dados enviada nos testes, e utilizado o plugin Allure para geração dos relatorios de resultados em HTML e Videos.

## Execução

### Pré-Requisitos

- [Git](https://git-scm.com/download/) e [Node.js](https://nodejs.org/en/download/) instalado.

### Instalando as dependências e executando os testes

Todos os comandos abaixo são executados pelo _prompt de comando_.

**1** - Clone o repositório e acesse o diretório criado:

```sh
git clone https://github.com/GustavoAvila123/QualityMap.API.Cypress.git
```

**2** - Instale as depedências necessárias para rodar os testes:

```sh
npx install
```

**3** - Você pode escolher rodar os testes no modo com interface gráfica(GUI) ou em Headless, para rodar com o GUI, digite o seguinte comando e depois disso escolha qual spec você quer rodar:

```sh
npx cypress open
```

**4** - Para rodar o modo Headless, digite:

```sh
npm test
```

**4** - Após rodar o modo Headless, digite o comando para gerar o relatório em HTML:

```sh
npm run report
```
---