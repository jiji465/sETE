import React, { useMemo, useEffect, useRef } from 'react';
import type { DebtItem, SortState, PaginationState } from '../types';
import { STATUS } from '../data';
import { formatDate, parseDate, formatCurrency } from '../utils';
import { Icon } from './ui';

const StatusBadge: React.FC<{ situacao: string }> = ({ situacao }) => {
    const statusKey = situacao.replace(/\s/g, '_');
    const statusClass = `status-${statusKey}`;
    return <span className={`status-badge ${statusClass}`}>{situacao}</span>;
}

const InstallmentCell: React.FC<{ item: DebtItem }> = ({ item }) => {
    const details = item.installmentDetails;
    if (!details || details.paidCount === null || details.totalCount === null) {
        return <>{item.nomeDebito}</>;
    }
    const progress = details.totalCount > 0 ? (details.paidCount / details.totalCount) * 100 : 0;
    return (
        <div>
            <p className="font-medium">{item.nomeDebito}</p>
            <div className="flex items-center gap-3 mt-2">
                <div className="w-24">
                    <div className="progress-bar-container">
                        <div className="progress-bar" style={{ width: `${progress}%` }}></div>
                    </div>
                </div>
                <span className="text-xs font-semibold text-[var(--text-secondary)]">{details.paidCount} / {details.totalCount} parcelas</span>
            </div>
            {details.remainingBalance !== null && (
                 <p className="text-xs mt-1 text-[var(--text-secondary)]">
                    Saldo Devedor: <span className="font-bold">{formatCurrency(details.remainingBalance)}</span>
                </p>
            )}
        </div>
    );
};


interface DebtTableProps {
    data: DebtItem[];
    sort: SortState;
    onSort: (key: keyof DebtItem) => void;
    pagination: PaginationState;
    setPagination: (pagination: React.SetStateAction<PaginationState>) => void;
    totalItems: number;
    expandedRows: Set<string>;
    onToggleRow: (id: string) => void;
    selectedRows: Set<string>;
    onToggleSelectRow: (id: string) => void;
    onToggleSelectAll: () => void;
}

export const DebtTable: React.FC<DebtTableProps> = React.memo(({ data, sort, onSort, pagination, setPagination, totalItems, expandedRows, onToggleRow, selectedRows, onToggleSelectRow, onToggleSelectAll }) => {
    
    const headerCheckboxRef = useRef<HTMLInputElement>(null);
    const currentPageIds = useMemo(() => new Set(data.map(item => item.id)), [data]);
    const selectedOnPageCount = useMemo(() => {
        let count = 0;
        for (const id of selectedRows) {
            if (currentPageIds.has(id)) count++;
        }
        return count;
    }, [selectedRows, currentPageIds]);

    useEffect(() => {
        if (headerCheckboxRef.current) {
            const allOnPageSelected = selectedOnPageCount === data.length && data.length > 0;
            headerCheckboxRef.current.checked = allOnPageSelected;
            headerCheckboxRef.current.indeterminate = !allOnPageSelected && selectedOnPageCount > 0;
        }
    }, [selectedOnPageCount, data.length]);

    const totalPages = Math.ceil(totalItems / pagination.itemsPerPage);

    const renderSortIcon = (key: keyof DebtItem) => {
        if (sort.key !== key) return <Icon name="arrow-up-down" className="sort-icon w-3 h-3 ml-2" />;
        return sort.dir === 'asc' ? <Icon name="arrow-up" className="sort-icon active w-3 h-3 ml-2" /> : <Icon name="arrow-down" className="sort-icon active w-3 h-3 ml-2" />;
    };

    const headers: { key: keyof DebtItem; label: string; className?: string }[] = [
        { key: 'empresa', label: 'Empresa', className: 'min-w-[200px]' },
        { key: 'nomeDebito', label: 'Nome do Débito', className: 'min-w-[250px]' },
        { key: 'vencimento', label: 'Vencimento', className: 'text-center min-w-[100px]' },
        { key: 'situacao', label: 'Situação', className: 'text-center min-w-[120px]' },
        { key: 'valor', label: 'Valor Total', className: 'text-right min-w-[120px]' },
    ];
    
    return (
        <div className="table-container">
            <div className="overflow-x-auto">
                <table className="w-full text-sm">
                    <thead className="table-header">
                        <tr>
                            <th className="p-3 w-12 text-center">
                                <input ref={headerCheckboxRef} type="checkbox" className="table-checkbox" onChange={onToggleSelectAll} aria-label="Selecionar todos na página" />
                            </th>
                            <th className="p-3 text-left w-8"></th>
                            {headers.map(({ key, label, className }) => (
                                <th key={key} className={`p-3 text-left ${className || ''}`} onClick={() => onSort(key)}>
                                    <div className={`flex items-center ${className?.includes('text-right') ? 'justify-end' : ''} ${className?.includes('text-center') ? 'justify-center' : ''}`}>{label} {renderSortIcon(key)}</div>
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {data.map(item => (
                            <React.Fragment key={item.id}>
                                <tr className={`table-row ${item.situacao === STATUS.VENCIDO ? 'overdue' : ''} ${selectedRows.has(item.id) ? 'selected' : ''}`}>
                                    <td className="p-3 text-center">
                                        <input type="checkbox" className="table-checkbox" checked={selectedRows.has(item.id)} onChange={() => onToggleSelectRow(item.id)} aria-label={`Selecionar ${item.nomeDebito}`} />
                                    </td>
                                    <td className="p-3 text-center">
                                        {item.subRows && item.subRows.length > 0 && (
                                            <button onClick={() => onToggleRow(item.id)} className="p-1 rounded-full hover:bg-[var(--subtle-bg)]">
                                                <Icon name={expandedRows.has(item.id) ? 'chevron-down' : 'chevron-right'} className="w-4 h-4" />
                                            </button>
                                        )}
                                    </td>
                                    <td className="p-3 font-medium">{item.empresa}</td>
                                    <td className="p-3">
                                        {item.tipo === 'Parcelamento' ? <InstallmentCell item={item} /> : item.nomeDebito}
                                    </td>
                                    <td className="p-3 text-center">{formatDate(parseDate(item.vencimento))}</td>
                                    <td className="p-3 text-center"><StatusBadge situacao={item.situacao} /></td>
                                    <td className="p-3 text-right font-semibold">{formatCurrency(item.valor)}</td>
                                </tr>
                                {expandedRows.has(item.id) && item.subRows?.map(subRow => (
                                    <tr key={subRow.id} className="table-row sub-row">
                                        <td></td>
                                        <td></td>
                                        <td className="p-3 pl-8 text-[var(--text-secondary)]" colSpan={2}>
                                            <div className="flex items-center gap-2">
                                                <Icon name="corner-down-right" className="w-4 h-4 flex-shrink-0" />
                                                <span>{subRow.nomeDebito}</span>
                                            </div>
                                        </td>
                                        <td className="p-3 text-center text-[var(--text-secondary)]">{formatDate(parseDate(subRow.vencimento))}</td>
                                        <td className="p-3 text-center text-[var(--text-secondary)]"></td>
                                        <td className="p-3 text-right text-[var(--text-secondary)] font-medium">{formatCurrency(subRow.valor)}</td>
                                    </tr>
                                ))}
                            </React.Fragment>
                        ))}
                         {data.length === 0 && (
                            <tr>
                                <td colSpan={headers.length + 2} className="text-center p-8 text-[var(--text-secondary)]">
                                    Nenhum resultado encontrado.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
            {totalPages > 1 && (
                <div className="p-4 flex items-center justify-between flex-wrap gap-4">
                    <span className="text-sm text-[var(--text-secondary)]">
                        Mostrando {Math.min(pagination.itemsPerPage * (pagination.currentPage - 1) + 1, totalItems)} a {Math.min(pagination.itemsPerPage * pagination.currentPage, totalItems)} de {totalItems} resultados
                    </span>
                    <div className="flex items-center gap-2">
                        <button onClick={() => setPagination(p => ({...p, currentPage: p.currentPage - 1}))} disabled={pagination.currentPage === 1} className="pagination-btn p-2 rounded-md"><Icon name="chevron-left" className="w-4 h-4" /></button>
                        <span className="text-sm font-medium px-2">Página {pagination.currentPage} de {totalPages}</span>
                        <button onClick={() => setPagination(p => ({...p, currentPage: p.currentPage + 1}))} disabled={pagination.currentPage === totalPages} className="pagination-btn p-2 rounded-md"><Icon name="chevron-right" className="w-4 h-4" /></button>
                    </div>
                </div>
            )}
        </div>
    );
});
