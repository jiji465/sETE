
export interface RawDebtItem {
    EMPRESA: string;
    "Nome do Débito": string;
    Competência: string;
    "Vencimento Original": string;
    Principal: number | string;
    Multa: number | string;
    Juros: number | string;
    Total: number | string;
    " Total "?:  number | string;
    Situação: string;
    Column10?: string;
}

export interface InstallmentDetails {
    paidCount: number | null;
    totalCount: number | null;
    totalValue: number | null;
    remainingBalance: number | null;
}

export interface DebtItem {
    id: string;
    empresa: string;
    nomeDebito: string;
    competencia: string;
    competenciaFormatada: string;
    vencimento: string;
    principal: number;
    multa: number;
    juros: number;
    valor: number;
    situacao: string;
    tipo: string;
    installmentDetails?: InstallmentDetails;
    subRows?: DebtItem[];
}

export interface SortState {
    key: keyof DebtItem;
    dir: 'asc' | 'desc';
}

export interface PaginationState {
    currentPage: number;
    itemsPerPage: number;
}

export interface FilterState {
    search: string;
    startDate: string;
    endDate: string;
    situacoes: string[];
    tipos: string[];
    chartTipo: string | null;
}

// Global declarations for CDN libraries
declare global {
    var Chart: any;
    var lucide: {
        createIcons: () => void;
    };
}
