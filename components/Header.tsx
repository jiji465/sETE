import React from 'react';
import { Icon } from './ui';

interface HeaderProps {
    title: string;
    onMenuToggle: () => void;
    onRefresh: () => void;
    onExport: () => void;
}

export const Header: React.FC<HeaderProps> = React.memo(({ title, onMenuToggle, onRefresh, onExport }) => (
    <header className="app-header border-b border-[var(--border-color)] p-4 flex justify-between items-center sticky top-0 z-30">
        <div className="flex items-center gap-4">
            <button onClick={onMenuToggle} className="lg:hidden p-2 rounded-md hover:bg-[var(--primary-bg)]" aria-label="Abrir menu">
                <Icon name="menu" className="w-6 h-6" />
            </button>
            <h1 className="text-xl sm:text-2xl font-bold truncate" title={title}>{title}</h1>
        </div>
        <div className="flex items-center gap-3">
            <button onClick={onExport} className="bg-[var(--success)] text-white px-4 py-2 rounded-lg font-medium transition-all duration-200 flex items-center gap-2 hover:opacity-90" aria-label="Exportar dados filtrados">
                <Icon name="download" className="w-4 h-4" />
                <span className="hidden sm:inline">Exportar</span>
            </button>
            <button onClick={onRefresh} className="p-2 bg-[var(--primary-bg)] text-[var(--brand-dark-blue)] rounded-lg hover:bg-[var(--primary-bg-hover)] transition tooltip" data-tooltip="Atualizar dados" aria-label="Atualizar dados">
                <Icon name="refresh-cw" className="w-5 h-5 text-[var(--primary-fg)]" />
            </button>
        </div>
    </header>
));
