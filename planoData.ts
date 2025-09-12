export const planoData = {
  financeiro: {
    title: 'Área Financeira e Fiscal',
    description: 'Ações cruciais para organizar as finanças, garantir a conformidade fiscal e formar a base para a saúde financeira da empresa.',
    cards: [
      {
        title: 'Gestão de Receita e Notas',
        items: [
          'Implementar sistema ágil para emissão de notas fiscais de todos os serviços.',
          'Realizar levantamento completo da situação fiscal e criar plano de regularização de impostos.',
        ],
      },
      {
        title: 'Gestão de Despesas',
        items: [
          'Criar plano de contas para categorizar todas as despesas por empresa e centro de custo.',
          'Estruturar fluxo de caixa para garantir pagamentos nos prazos e contas corretas.',
        ],
      },
      {
        title: 'Gestão de Lucros',
        items: ['Definir uma política clara para retirada de lucros, baseada nos resultados e na disponibilidade de caixa.'],
      },
    ],
  },
  estoque: {
    title: 'Gestão de Estoque e Custos Operacionais',
    description: 'Otimizar a gestão de estoque e entender os custos de cada procedimento são fundamentais para a lucratividade.',
    sections: [
      {
        type: 'flow',
        title: 'Controle de Estoque e Compras',
        description: 'Um fluxo de compras bem definido evita desperdícios e garante que o estoque esteja sempre alinhado com a demanda.',
        steps: ['Auditoria do Estoque Atual', 'Estruturar Controle de Entradas/Saídas', 'Gerir Fluxo de Compras', 'Otimização Contínua'],
      },
      {
        type: 'card',
        title: 'Controle de Custos por Procedimento',
        items: [
          'Desenvolver método para apurar custos variáveis (insumos e mão de obra) de cada procedimento.',
          'Calcular o custo exato por procedimento para otimizar a precificação e as margens de lucro.',
        ],
      },
    ],
  },
  vendas: {
    title: 'Processo de Vendas e Relacionamento com o Cliente',
    description: 'A excelência no processo de vendas e a fidelização de clientes são os motores do crescimento sustentável.',
    sections: [
      {
        type: 'flow',
        title: 'Estrutura do Processo de Venda e Fidelização',
        description: 'Desde o primeiro contato até o pós-venda, cada passo é uma oportunidade para fortalecer o relacionamento e garantir a satisfação.',
        steps: ['Contato Inicial e Mapeamento', 'Validação e Confirmação', 'Execução e Entrega', 'Pós-venda e Feedback', 'Programa de Fidelização'],
        footer: 'Este processo estruturado visa minimizar estornos, que causam prejuízos tributários, de comissão e administrativos.',
      },
    ],
  },
  patrimonial: {
    title: 'Levantamento Patrimonial',
    description: 'Conhecer o valor real da empresa é essencial para a tomada de decisões estratégicas, negociações e planejamento de longo prazo.',
    cards: [
      {
        title: 'Levantamento de Ativos e Passivos',
        items: ['Realizar uma análise detalhada para identificar e registar todos os bens, direitos (ativos) e obrigações (passivos) da empresa.'],
      },
      {
        title: 'Análise Patrimonial',
        items: ['Com base no levantamento, apurar a situação patrimonial líquida do grupo, oferecendo uma fotografia precisa de sua saúde financeira e valor de mercado.'],
      },
    ],
  },
};
