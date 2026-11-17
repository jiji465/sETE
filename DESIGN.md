# Painel de débitos fiscais: crítica de design e sistema de design

Documento de referência do painel do Grupo Avant Garde (`index.html`). Reúne a crítica da versão anterior, a auditoria do sistema de design, os tokens e componentes da versão atual e o roteiro para atualizar os débitos.

## 1. Crítica de design da versão anterior (posição de 28/04/2026)

### Impressão geral

O painel tinha boa base visual (tema claro e escuro, cartões limpos, gráficos interativos), mas o número principal não aparecia inteiro e a tabela não mostrava a composição do débito. A maior oportunidade estava em transformar o painel numa ferramenta de trabalho: mostrar principal, multa e juros, calcular o atraso pela data e permitir levar a relação para o cliente.

### Usabilidade

| Achado | Gravidade | Recomendação |
|---|---|---|
| Os seis indicadores cortavam o valor com reticências em 1440 px ("R$ 456....") | 🔴 Crítica | Quatro indicadores por linha, valor sem corte e número principal em destaque |
| No celular a página estourava a largura: subtítulo e cartões cortados à direita | 🔴 Crítica | Grade fluida, cartões em uma ou duas colunas e tabela em formato de cartão |
| A situação (VENCIDO, A VENCER) vinha gravada no dado e ficava errada com o passar dos dias | 🔴 Crítica | Calcular o atraso pela data-base dos dados |
| O botão "Atualizar dados" chamava a inicialização de novo e duplicava os ouvintes de eventos; depois dele, cada clique agia duas vezes | 🔴 Crítica | Remover o botão, porque os dados são estáticos |
| A tabela mostrava só "Valor Atual", sem principal, multa, juros e totais | 🟡 Moderada | Colunas de principal, multa, juros e total, com linha de totais do filtro |
| Filtros espalhados em três lugares (barra lateral, gaveta e atalhos) | 🟡 Moderada | Empresas na lateral esquerda e uma barra de filtros acima da tabela |
| Os atalhos de período calculavam a data em UTC e podiam errar um dia à noite | 🟡 Moderada | Datas locais |
| A exportação levava só cinco colunas | 🟢 Menor | CSV com todas as colunas, no padrão do Excel em português |

### Hierarquia visual

- **O que chamava o olhar primeiro:** a marca repetida (barra lateral e cabeçalho) e as seis faixas coloridas dos indicadores. O total devido, que é a informação principal, aparecia cortado.
- **Fluxo de leitura:** marca, indicadores, gráficos e, abaixo da dobra, a tabela. Quem precisava da relação para cobrar ou pagar tinha de rolar até o fim.
- **Ênfase:** seis cores sem significado (roxo para juros, rosa para multa, verde para contagem) competiam entre si. Na versão atual a cor indica a série do gráfico (principal, multa, juros) ou a faixa de atraso.

### Consistência

| Elemento | Problema | Recomendação |
|---|---|---|
| Cores | 20 cores fixas fora dos tokens no CSS e 62 valores arbitrários do Tailwind no HTML | Todas as cores em tokens, nos dois temas |
| Raios | Sete raios diferentes (0,25 a 0,875 rem, 50%, 999 px) | Raios de 6, 10 e 14 px, mais o de pílula |
| Tipografia | Tamanhos do Tailwind misturados a `clamp()` e valores soltos | Escala de seis tamanhos |
| Ícones | lucide carregado em `@latest`, sem versão fixa | Ícones SVG no próprio arquivo |
| Recursos | Link para `index.css`, que não existe (erro 404) | Link removido |

### Acessibilidade

- **Contraste:** o texto terciário `#9ca3af` tinha 2,54:1 sobre branco. Agora é `#626B79`, com 5,39:1 sobre a superfície e 4,99:1 sobre o fundo.
- **Teclado:** os cabeçalhos ordenáveis só respondiam ao mouse e os seletores personalizados não abriam pelo teclado. Agora a ordenação usa botões com `aria-sort`, os filtros abrem por Enter ou Espaço, fecham com Esc e devolvem o foco à pílula, e a tecla `/` leva à busca.
- **Rótulos:** o botão de tema tinha rótulo em inglês ("Toggle theme"). Agora todos os rótulos estão em português.
- **Alvos de toque:** botões, pílulas e campos têm 38 px de altura ou mais.

### O que funcionava bem

- Tema escuro bem resolvido, com variáveis próprias.
- Gráficos que filtravam a tabela ao clique.
- Visualização da tabela em cartões no celular.

### Prioridades atendidas na versão atual

1. **Número principal legível e correto:** total vencido em destaque e atraso calculado pela data-base.
2. **Tabela de trabalho:** composição do débito, dias em atraso, totais, ordenação acessível, exportação completa e impressão.
3. **Sistema de design único:** tokens, componentes documentados e paleta de gráficos validada.

## 2. Auditoria do sistema de design

**Componentes revistos:** 9 (botão, indicador, cartão, tabela, selo de situação, filtro rápido, seletor personalizado, gaveta de filtros, barra lateral). **Problemas encontrados:** 16 (os das tabelas de usabilidade e consistência e os três de acessibilidade). **Nota atribuída nesta auditoria à versão anterior:** 52/100.

| Componente | Estados | Variantes | Documentação | Nota anterior |
|---|---|---|---|---|
| Botão | ✅ | ✅ | ❌ | 6/10 |
| Indicador | ⚠️ valor cortado | ⚠️ seis cores | ❌ | 4/10 |
| Tabela | ⚠️ sem teclado | ✅ | ❌ | 5/10 |
| Selo de situação | ✅ | ✅ | ❌ | 7/10 |
| Seletor personalizado | ⚠️ sem teclado | ✅ | ❌ | 4/10 |

## 3. Sistema de design atual

### Estrutura da página

Cabeçalho fixo com a marca, o título e as ações (exportar, imprimir, tema). Abaixo, duas colunas: à esquerda, a lista de empresas; à direita, os indicadores, os gráficos e a tabela com a barra de filtros. O painel mostra só os débitos vencidos na data-base dos dados. Abaixo de 1200 px a lista de empresas vira uma gaveta aberta pelo botão "Empresas"; abaixo de 900 px a tabela vira cartões.

### Tokens

Todos ficam em `:root` e em `html[data-theme="dark"]`, no topo do `<style>` de `index.html`.

| Grupo | Tokens | Uso |
|---|---|---|
| Marca | `--brand-navy`, `--brand-navy-2`, `--brand-blue`, `--brand-blue-strong` | Identidade, fundo do total vencido, ação principal |
| Superfície | `--bg`, `--surface`, `--surface-2`, `--surface-hover`, `--border`, `--border-strong` | Fundo da página, cartões, cabeçalho da tabela, linha sob o ponteiro, divisórias |
| Texto | `--text`, `--text-2`, `--text-3` | Título e valor, texto de apoio, legenda (todos com 4,5:1 ou mais) |
| Interação | `--primary`, `--primary-strong`, `--primary-soft`, `--on-primary`, `--focus` | Botões, seleção, filtro ativo, foco |
| Atraso | `--warning` (até 90 dias), `--serious` (91 dias a 1 ano), `--critical` (mais de 1 ano e dívida ativa) | Marcador de atraso, sempre ao lado do número de dias |
| Gráficos | `--series-1`, `--series-2`, `--series-3`, `--chart-grid` | Principal, multa, juros e encargos |
| Tipografia | `--fs-xs` 12, `--fs-sm` 14, `--fs-md` 16, `--fs-lg` 20, `--fs-xl` 24, `--fs-2xl` 32 | Fonte Inter; números com algarismos tabulares (`.num`) |
| Espaço | `--sp-1` 4 a `--sp-10` 40 | Grade de 4 px |
| Forma | `--r-sm` 6, `--r-md` 10, `--r-lg` 14, `--r-pill` | Campos, botões, cartões, pílulas |
| Elevação | `--shadow-1`, `--shadow-2` | Repouso e painéis suspensos |
| Movimento | `--dur-fast` 120 ms, `--dur` 200 ms, `--ease` | Transições; desligadas com `prefers-reduced-motion` |

### Paleta dos gráficos

As três séries usam os três primeiros tons da paleta categórica validada (azul, laranja, água), na mesma ordem nos dois temas. O validador aprovou as duas versões: separação para daltonismo de 9,2 no claro e 9,4 no escuro (alvo de 8 ou mais) e distância para visão normal de 27,6 e 26,5 (piso de 15). No tema claro, o tom água tem 2,82:1 sobre a superfície; por isso cada gráfico tem legenda e a tabela traz os mesmos valores. A cor segue a série (principal é sempre azul) e não muda com o filtro. As cores de atraso são tokens próprios e nunca aparecem como série.

### Componentes

**Botão.** Variantes `btn-primary` (ação principal), `btn-secondary` (exportar, imprimir, paginação) e `btn-ghost` (limpar filtros, tema); `btn-icon` para botão só com ícone, sempre com `aria-label`. Estados: repouso, passar o mouse, foco visível de 2 px e desativado com 45% de opacidade.

**Indicador (`.kpi`).** Rótulo com ponto de cor, valor com algarismos tabulares, sem quebra de linha, e linha de apoio com a participação no total. A variante `kpi-hero` destaca o total vencido e traz a barra de composição (principal, multa, juros).

**Lista de empresas (`.company-item`).** Caixas de seleção nativas, escondidas atrás de um cartão com as iniciais, a razão social, o CNPJ, o total vencido e o número de débitos. Selecionar ou tirar uma empresa filtra indicadores, gráficos e tabela. "Selecionar todas" e "Limpar seleção" ficam no topo; o rodapé soma as empresas selecionadas. Clicar na barra de uma empresa no gráfico deixa só ela selecionada; um segundo clique volta a todas.

**Busca (`.search`).** Campo em pílula, sem diferenciar acentos e maiúsculas, que procura em empresa, CNPJ, tributo, código, natureza, competência e observação; vários termos se somam ("cofins 06/2025"). A tecla `/` leva o foco ao campo.

**Pílula de filtro (`.pill`) e painel suspenso (`.popover`).** Uma pílula por filtro: Esfera, Natureza, Atraso e Vencimento. Inativa, tem borda tracejada e o sinal de mais; ativa, ganha fundo azul claro, mostra o valor escolhido ("Faturamento +1") e um botão × que remove só aquele filtro. O painel lista as opções com caixa de seleção e a contagem de débitos que cada uma traria com os demais filtros aplicados. Vencimento tem intervalo de datas e atalhos (este ano, ano passado, antes disso). Esc ou clique fora fecham o painel; no celular ele sobe da base da tela. "Limpar filtros" só aparece quando há filtro ativo.

**Marcador de atraso (`.aging`).** Ponto colorido seguido do número de dias ("566 dias de atraso") ou de "dívida ativa", logo abaixo da data de vencimento. A cor reforça a faixa, e o texto carrega a informação.

**Tabela.** Cabeçalho fixo dentro da área de rolagem, ordenação por botão com `aria-sort`, rodapé fixo com os totais do filtro e paginação de 25, 50, 100 ou todas as linhas. Quando a área da tabela tem menos de 1060 px (consulta de contêiner), a competência passa para baixo do tributo e multa e juros viram uma coluna só, com o detalhamento em duas linhas; assim a tabela cabe sem rolagem lateral. Abaixo de 900 px cada linha vira um cartão com rótulos. Na impressão saem todas as linhas, com as colunas completas, sem filtros e sem gráficos.

| ✅ Faça | ❌ Não faça |
|---|---|
| Use os tokens de cor e espaço | Escrever cor em hexadecimal fora de `:root` |
| Ponha o número de dias ao lado de toda cor de atraso | Usar só a cor para indicar atraso |
| Mantenha a ordem das séries dos gráficos | Recolorir as séries conforme o filtro |
| Escreva a razão social completa | Abreviar o nome da empresa em rótulos e gráficos |

## 4. Como atualizar os débitos

Os dados ficam na constante `DADOS`, dentro de `index.html`. Para uma nova posição, troque `dataBase` (data no formato AAAA-MM-DD) e a lista `debitos`. O painel mostra só os débitos com vencimento anterior à `dataBase` e os sem vencimento (dívida ativa); os dias em atraso, os totais e os gráficos se recalculam sozinhos.

| Campo | Exemplo | Observação |
|---|---|---|
| `empresa` | "Avant Spa Ltda" | Razão social |
| `cnpj` | "45.147.037/0001-85" | |
| `esfera` | "Federal", "Estadual" ou "Municipal" | |
| `tributo` | "IRPJ" | |
| `codigo` | "2089-01" | Código de receita, quando houver |
| `natureza` | "Faturamento" | Faturamento, Retenção de serviços tomados, Retenção sobre aluguel (PF), Folha de pagamento, Parcelamento, ICMS DIFAL (uso e consumo), Multa por atraso de declaração |
| `competencia` | "1º TRIM/2026", "08/2026", "Parcela 5 de 10" | Texto livre |
| `vencimento` | "2026-04-30" ou `null` | `null` para dívida ativa sem data; conta como vencida |
| `principal`, `multa`, `juros`, `encargos` | 4318.5 | Números com ponto decimal |
| `total` | 5512.56 | Soma dos quatro valores |
| `obs`, `fonte` | "Parcelamento nº ..." | `obs` aparece na tabela; as duas vão ao CSV |

## 5. Registro de mudanças

**17/11/2026, ajuste.** Saíram do painel os dois débitos de ISS do Instituto de Fisiologia Humana Ltda das competências 07/2026 (R$ 17.231,62) e 08/2026 (R$ 17.355,32). O painel passa a ter 96 débitos vencidos, R$ 694.886,54.

**17/11/2026, segunda versão.** O painel passou a mostrar só os débitos vencidos: 98 débitos, R$ 729.473,48. Saíram a data de posição do cabeçalho e a seção "Fontes e observações". As empresas ficaram numa lista de seleção à esquerda. A barra de filtros foi refeita com busca (atalho `/`) e pílulas com painel suspenso para esfera, natureza, faixa de atraso e vencimento, cada uma com contagem por opção e remoção individual. O atraso passou para baixo do vencimento, com marcador colorido por faixa. A tabela ganhou o modo compacto para telas médias, e a impressão saiu com as colunas completas. Os gráficos e a tabela usam a razão social completa.

**17/11/2026.** Débitos atualizados para a posição de 17/11/2026. Nova interface com o sistema de design acima, colunas de composição, natureza do débito, exportação CSV completa, impressão e correção dos erros listados na crítica. Saíram do painel o Tailwind, o lucide e o adaptador de datas do Chart.js; ficou só o Chart.js, com versão fixa. Itens da posição de 28/04/2026 que não fazem parte do novo levantamento não foram mantidos: FGTS de 03/2026, contribuições previdenciárias da Avantgarde Group de 03/2025 e o parcelamento municipal de ISS da Avantgarde Cursos.
