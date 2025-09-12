import React from 'react';
import { STATUS } from '../data';
import { Icon } from './ui';

const QUICK_FILTER_OPTIONS: { label: string; value: string[] }[] = [
    { label: 'Todos', value: [] },
    { label: 'Vencidos', value: [STATUS.VENCIDO] },
    { label: 'A Vencer', value: [STATUS.A_VENCER] },
    { label: 'Pagos', value: [STATUS.PAGO] },
    { label: 'Ignorados', value: [STATUS.IGNORADO] },
];

interface QuickFiltersProps {
    selectedSituacoes: string[];
    onFilterChange: (situacoes: string[]) => void;
}

export const QuickFilters: React.FC<QuickFiltersProps> = React.memo(({ selectedSituacoes, onFilterChange }) => {
    const selectedValueString = JSON.stringify(selectedSituacoes.sort());

    return (
        <div className="flex items-center gap-2 flex-wrap">
            <h4 className="text-sm font-semibold text-[var(--text-secondary)] mr-2 flex items-center gap-2">
                <Icon name="zap" className="w-4 h-4" />
                Filtros Rápidos:
            </h4>
            {QUICK_FILTER_OPTIONS.map(({ label, value }) => {
                const isActive = JSON.stringify(value.sort()) === selectedValueString;
                return (
                    <button
                        key={label}
                        className={`quick-filter-btn ${isActive ? 'active' : ''}`}
                        onClick={() => onFilterChange(value)}
                    >
                        {label}
                    </button>
                );
            })}
        </div>
    );
});
