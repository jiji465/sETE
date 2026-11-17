# Débitos fiscais do Grupo Avant Garde

Painel com os débitos fiscais vencidos das empresas do grupo: seleção de empresas na lateral, total vencido com a composição de principal, multa e juros, gráficos por empresa e por natureza, tabela com busca e filtros por esfera, natureza, atraso e vencimento, exportação em CSV e impressão.

Aplicativo no AI Studio: https://ai.studio/apps/e36747bc-397f-4a59-be25-21e8ea31a621

## Rodar no computador

Pré-requisito: Node.js.

1. Instale as dependências: `npm install`
2. Rode o aplicativo: `npm run dev`

O painel é um único arquivo, `index.html`, e também abre direto no navegador.

## Atualizar os débitos

Os dados ficam na constante `DADOS`, dentro de `index.html`. O roteiro dos campos está em [DESIGN.md](DESIGN.md), seção 4.

## Design

Crítica de design, auditoria, tokens e componentes: [DESIGN.md](DESIGN.md).
