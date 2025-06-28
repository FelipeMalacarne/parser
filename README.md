# Analisador Sintático LL(1)

Este projeto é uma implementação de um analisador sintático preditivo (LL(1)) para uma gramática livre de contexto específica. A aplicação web interativa permite aos usuários visualizar a gramática, os conjuntos FIRST e FOLLOW, a tabela de parsing, e testar sentenças para verificar se pertencem à linguagem.

**Acesse a aplicação aqui:** [https://felipemalacarne.github.io/parser/](https://felipemalacarne.github.io/parser/)

## Integrantes

* **Felipe Malacarne**
* **Mateus Zanella**

## Funcionalidades

*   **Visualização da Gramática:** Exibe as regras de produção da gramática LL(1) utilizada.
*   **Conjuntos FIRST e FOLLOW:** Mostra os conjuntos FIRST e FOLLOW para cada não-terminal.
*   **Tabela de Parsing:** Apresenta a tabela de parsing LL(1) completa.
*   **Análise de Sentenças:**
    *   **Entrada Manual:** Permite que o usuário insira uma sentença para ser validada pelo analisador.
    *   **Geração de Sentenças:** Gera sentenças válidas aleatoriamente com base na gramática.
*   **Rastreamento da Execução:** Mostra o passo a passo do processo de análise, incluindo o estado da pilha, a entrada restante e a ação tomada.
*   **Contexto da Sentença:** Fornece uma descrição do significado da sentença dentro da linguagem definida.
*   **Tema Claro e Escuro:** Alterna entre os temas para melhor visualização.

## Gramática Implementada

A gramática livre de contexto utilizada no projeto é a seguinte:

```
S -> a A | b B
A -> c C | d D | ε
B -> c C | d D
C -> a S
D -> b B
```

Onde:
*   **Terminais:** `a, b, c, d`
*   **Não-Terminais:** `S, A, B, C, D`
*   **Símbolo Inicial:** `S`
*   **Épsilon (sentença vazia):** `ε`

## Tecnologias Utilizadas

*   **React**
*   **TypeScript**
*   **Vite**
*   **Tailwind CSS**
*   **shadcn/ui**
*   **gh-pages** (para deploy no GitHub Pages)

## Como Executar o Projeto Localmente

1.  **Clone o repositório:**
    ```bash
    git clone https://github.com/FelipeMalacarne/parser.git
    ```
2.  **Navegue até o diretório do projeto:**
    ```bash
    cd parser
    ```
3.  **Instale as dependências:**
    ```bash
    npm install
    ```
4.  **Inicie o servidor de desenvolvimento:**
    ```bash
    npm run dev
    ```

A aplicação estará disponível em `http://localhost:5173`.

## Deploy

O deploy da aplicação é feito automaticamente para o GitHub Pages através de uma action do GitHub sempre que um novo push é feito para a branch `main`.

O script de deploy pode ser executado manualmente com o comando:
```bash
npm run deploy
```