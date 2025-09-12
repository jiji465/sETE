import { useReducer, useEffect, useMemo, useCallback } from 'react';
import type { RawDebtItem, DebtItem, SortState, PaginationState, FilterState, InstallmentDetails } from '../types';
import { DEBITOS_DATA_RAW, STATUS } from '../data';
import { formatCompetencia, extractType, parseInstallmentDetails as parseInstallmentDetailsUtil, parseDate } from '../utils';

export const parseNumericValue = (val: any): number => {
    if (typeof val === 'number') return val;
    if (typeof val === 'string') {
        const cleaned = val.replace(/R\$\s?/, '').trim();
        if (cleaned === '' || cleaned === '-') return 0;
        return parseFloat(cleaned.replace(/\./g, '').replace(',', '.')) || 0;
    }
    return 0;
};

const processData = (rawData: RawDebtItem[]): DebtItem[] => {
    const sanitizedData = rawData.map(row => ({...row, Total: row[' Total '] ? row[' Total '] : row.Total}));
    let idCounter = 0;

    return sanitizedData.reduce<DebtItem[]>((acc, row) => {
        if (!row.EMPRESA || !row['Nome do Débito']) return acc;

        const competenciaStr = String(row.Competência);
        const commonData: DebtItem = {
            id: `debt-${idCounter++}`,
            empresa: row.EMPRESA.trim(),
            nomeDebito: row['Nome do Débito'],
            competencia: competenciaStr,
            competenciaFormatada: formatCompetencia(competenciaStr),
            vencimento: row['Vencimento Original'],
            principal: parseNumericValue(row.Principal),
            multa: parseNumericValue(row.Multa),
            juros: parseNumericValue(row.Juros),
            valor: parseNumericValue(row.Total),
            situacao: row.Situação,
            tipo: extractType(row['Nome do Débito'])
        };

        if (commonData.tipo === 'Parcelamento') {
            commonData.installmentDetails = parseInstallmentDetailsUtil(row);
        }

        if (row.Situação === STATUS.ORIGEM_PARCELAMENTO) {
            const lastParcelamento = [...acc].reverse().find(d => d.tipo === 'Parcelamento' && d.empresa === commonData.empresa);
            if (lastParcelamento) {
                if (!lastParcelamento.subRows) lastParcelamento.subRows = [];
                lastParcelamento.subRows.push(commonData);
            } else {
                acc.push(commonData);
            }
        } else {
            acc.push(commonData);
        }
        return acc;
    }, []);
};

type State = {
    isLoading: boolean;
    processedData: DebtItem[];
    activeCompanies: Set<string>;
    sort: SortState;
    pagination: PaginationState;
    filters: FilterState;
    tempFilters: FilterState;
    tempActiveCompanies: Set<string>;
    expandedRows: Set<string>;
    selectedRows: Set<string>;
};

type Action =
    | { type: 'START_LOADING' }
    | { type: 'DATA_LOADED', payload: { data: DebtItem[], companies: string[] } }
    | { type: 'REFRESH_DATA' }
    | { type: 'SET_SORT', payload: keyof DebtItem }
    | { type: 'SET_PAGINATION', payload: React.SetStateAction<PaginationState> }
    | { type: 'SET_FILTER', payload: { key: keyof FilterState, value: any } }
    | { type: 'SET_CHART_TIPO_FILTER', payload: string | null }
    | { type: 'TOGGLE_COMPANY', payload: { company: string, isChecked: boolean } }
    | { type: 'TOGGLE_ALL_COMPANIES', payload: boolean }
    | { type: 'TOGGLE_EXPAND_ROW', payload: string }
    | { type: 'TOGGLE_SELECT_ROW', payload: string }
    | { type: 'TOGGLE_SELECT_ALL_ON_PAGE', payload: string[] }
    | { type: 'SET_SELECTED_ROWS', payload: Set<string> }
    | { type: 'BULK_ACTION', payload: 'paid' | 'ignore' }
    | { type: 'SET_TEMP_FILTER', payload: { key: keyof FilterState, value: any } }
    | { type: 'SET_TEMP_COMPANIES', payload: Set<string> }
    | { type: 'APPLY_TEMP_FILTERS' }
    | { type: 'CLEAR_TEMP_FILTERS' }
    | { type: 'SYNC_FILTERS_TO_TEMP' };

const initialState: State = {
    isLoading: true,
    processedData: [],
    activeCompanies: new Set(),
    sort: { key: 'vencimento', dir: 'asc' },
    pagination: { currentPage: 1, itemsPerPage: 10 },
    filters: { search: '', startDate: '', endDate: '', situacoes: [], tipos: [], chartTipo: null },
    tempFilters: { search: '', startDate: '', endDate: '', situacoes: [], tipos: [], chartTipo: null },
    tempActiveCompanies: new Set(),
    expandedRows: new Set(),
    selectedRows: new Set(),
};

function reducer(state: State, action: Action): State {
    switch (action.type) {
        case 'START_LOADING': return { ...state, isLoading: true };
        case 'DATA_LOADED': {
            const allCompaniesSet = new Set(action.payload.companies);
            return {
                ...state,
                isLoading: false,
                processedData: action.payload.data,
                activeCompanies: allCompaniesSet,
                tempActiveCompanies: allCompaniesSet,
            };
        }
        case 'REFRESH_DATA': return { ...state, selectedRows: new Set() };
        case 'SET_SORT': {
            const newDir = state.sort.key === action.payload && state.sort.dir === 'asc' ? 'desc' : 'asc';
            return { ...state, sort: { key: action.payload, dir: newDir }, pagination: { ...state.pagination, currentPage: 1 }, selectedRows: new Set() };
        }
        case 'SET_PAGINATION':
            const newPagination = typeof action.payload === 'function' ? action.payload(state.pagination) : action.payload;
            return { ...state, pagination: newPagination };
        case 'SET_FILTER': return { ...state, filters: { ...state.filters, [action.payload.key]: action.payload.value }, pagination: { ...state.pagination, currentPage: 1 }, selectedRows: new Set() };
        case 'SET_CHART_TIPO_FILTER':
            const newChartTipo = state.filters.chartTipo === action.payload ? null : action.payload;
            return { ...state, filters: { ...state.filters, chartTipo: newChartTipo } };
        case 'TOGGLE_COMPANY': {
            const newSet = new Set(state.activeCompanies);
            if (action.payload.isChecked) newSet.add(action.payload.company);
            else newSet.delete(action.payload.company);
            return { ...state, activeCompanies: newSet, pagination: { ...state.pagination, currentPage: 1 }, selectedRows: new Set() };
        }
        case 'TOGGLE_ALL_COMPANIES': {
            const allCompanies = [...new Set(state.processedData.map(d => d.empresa))];
            return { ...state, activeCompanies: action.payload ? new Set(allCompanies) : new Set(), pagination: { ...state.pagination, currentPage: 1 }, selectedRows: new Set() };
        }
        case 'TOGGLE_EXPAND_ROW': {
            const newSet = new Set(state.expandedRows);
            if (newSet.has(action.payload)) newSet.delete(action.payload);
            else newSet.add(action.payload);
            return { ...state, expandedRows: newSet };
        }
        case 'TOGGLE_SELECT_ROW': {
            const newSet = new Set(state.selectedRows);
            if (newSet.has(action.payload)) newSet.delete(action.payload);
            else newSet.add(action.payload);
            return { ...state, selectedRows: newSet };
        }
        case 'TOGGLE_SELECT_ALL_ON_PAGE': {
            const pageIds = action.payload;
            const allSelectedOnPage = pageIds.length > 0 && pageIds.every(id => state.selectedRows.has(id));
            const newSet = new Set(state.selectedRows);
            if (allSelectedOnPage) {
                pageIds.forEach(id => newSet.delete(id));
            } else {
                pageIds.forEach(id => newSet.add(id));
            }
            return { ...state, selectedRows: newSet };
        }
        case 'SET_SELECTED_ROWS': return { ...state, selectedRows: action.payload };
        case 'BULK_ACTION': {
            const newStatus = action.payload === 'paid' ? STATUS.PAGO : STATUS.IGNORADO;
            const newData = state.processedData.map(item => state.selectedRows.has(item.id) ? { ...item, situacao: newStatus } : item);
            return { ...state, processedData: newData, selectedRows: new Set() };
        }
        case 'SET_TEMP_FILTER': return { ...state, tempFilters: { ...state.tempFilters, [action.payload.key]: action.payload.value } };
        case 'SET_TEMP_COMPANIES': return { ...state, tempActiveCompanies: action.payload };
        case 'APPLY_TEMP_FILTERS': return { ...state, filters: state.tempFilters, activeCompanies: state.tempActiveCompanies, pagination: { ...state.pagination, currentPage: 1 } };
        case 'CLEAR_TEMP_FILTERS': {
             const allCompanies = [...new Set(state.processedData.map(d => d.empresa))];
             return {
                ...state,
                tempFilters: { ...initialState.filters, search: state.filters.search },
                tempActiveCompanies: new Set(allCompanies)
            };
        }
        case 'SYNC_FILTERS_TO_TEMP':
            return {
                ...state,
                tempFilters: state.filters,
                tempActiveCompanies: new Set(state.activeCompanies),
            };
        default: return state;
    }
}

export const useDebts = () => {
    const [state, dispatch] = useReducer(reducer, initialState);

    const loadData = useCallback(() => {
        dispatch({ type: 'START_LOADING' });
        setTimeout(() => {
            const data = processData(DEBITOS_DATA_RAW);
            const companies = [...new Set(data.map(d => d.empresa).filter(Boolean))].sort();
            dispatch({ type: 'DATA_LOADED', payload: { data, companies } });
        }, 500);
    }, []);

    useEffect(() => {
        loadData();
    }, [loadData]);

    const allCompanies = useMemo(() => [...new Set(state.processedData.map(d => d.empresa).filter(Boolean))].sort(), [state.processedData]);
    const allSituacoes = useMemo(() => [...new Set([...state.processedData.map(d => d.situacao).filter(s => s !== STATUS.ORIGEM_PARCELAMENTO), STATUS.PAGO, STATUS.IGNORADO])].sort(), [state.processedData]);
    const allTipos = useMemo(() => [...new Set(state.processedData.map(d => d.tipo))].sort(), [state.processedData]);

    const filteredData = useMemo(() => {
        const parentRows = state.processedData.filter(item => item.situacao !== STATUS.ORIGEM_PARCELAMENTO);
        return parentRows.filter(item => {
            if (!state.activeCompanies.has(item.empresa)) return false;
            const searchLower = state.filters.search.toLowerCase();
            if (searchLower && !item.empresa.toLowerCase().includes(searchLower) && !item.nomeDebito.toLowerCase().includes(searchLower)) return false;
            const vencimentoDate = parseDate(item.vencimento);
            if (state.filters.startDate || state.filters.endDate) {
                if (!vencimentoDate) return false;
                if (state.filters.startDate && vencimentoDate < new Date(state.filters.startDate + 'T00:00:00')) return false;
                if (state.filters.endDate && vencimentoDate > new Date(state.filters.endDate + 'T23:59:59')) return false;
            }
            if (state.filters.situacoes.length > 0 && !state.filters.situacoes.includes(item.situacao)) return false;
            if (state.filters.tipos.length > 0 && !state.filters.tipos.includes(item.tipo)) return false;
            if (state.filters.chartTipo && item.tipo !== state.filters.chartTipo) return false;
            return true;
        });
    }, [state.processedData, state.activeCompanies, state.filters]);

    const sortedData = useMemo(() => {
        return [...filteredData].sort((a, b) => {
            const valA = a[state.sort.key];
            const valB = b[state.sort.key];
            let compare = 0;
            if (state.sort.key === 'vencimento') {
                const dateA = parseDate(valA as string)?.getTime() || 0;
                const dateB = parseDate(valB as string)?.getTime() || 0;
                compare = dateA - dateB;
            } else if (typeof valA === 'number' && typeof valB === 'number') {
                compare = valA - valB;
            } else {
                compare = String(valA).localeCompare(String(valB));
            }
            return state.sort.dir === 'asc' ? compare : -compare;
        });
    }, [filteredData, state.sort]);

    const paginatedData = useMemo(() => {
        const start = (state.pagination.currentPage - 1) * state.pagination.itemsPerPage;
        return sortedData.slice(start, start + state.pagination.itemsPerPage);
    }, [sortedData, state.pagination]);

    const kpis = useMemo(() => {
        const activeDebt = filteredData.filter(item => item.situacao === STATUS.VENCIDO || item.situacao === STATUS.A_VENCER);
        
        let filterCount = 0;
        if (state.filters.startDate || state.filters.endDate) filterCount++;
        if (state.filters.situacoes.length > 0) filterCount++;
        if (state.filters.tipos.length > 0) filterCount++;
        if (allCompanies.length > 0 && state.activeCompanies.size < allCompanies.length) filterCount++;

        return {
            totalDebt: activeDebt.reduce((acc, item) => acc + item.valor, 0),
            overdueDebt: activeDebt.reduce((acc, item) => acc + (item.situacao === STATUS.VENCIDO ? item.valor : 0), 0),
            upcomingDebt: activeDebt.reduce((acc, item) => acc + (item.situacao === STATUS.A_VENCER ? item.valor : 0), 0),
            totalDebtsCount: filteredData.length,
            activeFilterCount: filterCount,
        };
    }, [filteredData, state.filters, state.activeCompanies, allCompanies]);

    return {
        state,
        dispatch,
        kpis,
        paginatedData,
        sortedData,
        filteredData,
        allCompanies,
        allSituacoes,
        allTipos,
    };
};