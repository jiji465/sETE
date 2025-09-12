import React from 'react';
import { Icon } from './ui';

interface BulkActionBarProps {
    selectedCount: number;
    onAction: (action: 'paid' | 'ignore') => void;
    onClear: () => void;
}

export const BulkActionBar: React.FC<BulkActionBarProps> = React.memo(({ selectedCount, onAction, onClear }) => {
    return (
        <div className={`bulk-action-bar ${selectedCount > 0 ? 'show' : ''}`} role="toolbar" aria-label="Ações em massa">
            <span className="font-semibold text-sm">{selectedCount} selecionado(s)</span>
            <div className="flex items-center gap-3 ml-auto">
                <button onClick={() => onAction('paid')} className="bg-[var(--success)] text-white px-3 py-1.5 rounded-lg font-medium transition-all duration-200 flex items-center gap-2 hover:opacity-90 text-sm">
                    <Icon name="check-circle" className="w-4 h-4" /> Marcar como Pago
                </button>
                <button onClick={() => onAction('ignore')} className="bg-gray-500 text-white px-3 py-1.5 rounded-lg font-medium transition-all duration-200 flex items-center gap-2 hover:opacity-90 text-sm">
                    <Icon name="archive" className="w-4 h-4" /> Ignorar
                </button>
            </div>
            <button onClick={onClear} className="p-2 rounded-full hover:bg-[var(--subtle-bg)]" aria-label="Limpar seleção">
                <Icon name="x" className="w-5 h-5 text-[var(--text-secondary)]" />
            </button>
        </div>
    )
});
