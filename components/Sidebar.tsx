import React from 'react';
import { Icon, Logo } from './ui';

interface SidebarProps {
    isOpen: boolean;
    allCompanies: string[];
    activeCompanies: Set<string>;
    onCompanyChange: (company: string, isChecked: boolean) => void;
    onToggleAll: (isChecked: boolean) => void;
}

export const Sidebar: React.FC<SidebarProps> = React.memo(({ isOpen, allCompanies, activeCompanies, onCompanyChange, onToggleAll }) => (
    <aside className={`sidebar w-72 flex-shrink-0 p-4 flex flex-col fixed inset-y-0 left-0 z-40 transition-transform lg:translate-x-0 lg:flex ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="flex items-center justify-center gap-3 mb-10 px-2 pt-4">
            <Logo />
        </div>
        <nav className="flex flex-col gap-1 flex-1 overflow-y-auto pr-2">
            <h3 className="text-xs font-semibold text-[var(--text-tertiary)] uppercase px-3 mt-4 mb-2">Empresas</h3>
            <label className="sidebar-label flex items-center gap-3 px-3 py-2 cursor-pointer rounded-md">
                <input
                    type="checkbox"
                    className="w-5 h-5 rounded"
                    checked={activeCompanies.size === allCompanies.length && allCompanies.length > 0}
                    onChange={(e) => onToggleAll(e.target.checked)}
                    aria-label="Selecionar todas as empresas"
                />
                <span className="text-sm font-medium">Selecionar todas</span>
            </label>
            {allCompanies.map(c => (
                <label key={c} className="sidebar-label flex items-start gap-3 rounded-md px-3 py-2.5 text-sm font-medium cursor-pointer">
                    <input
                        type="checkbox"
                        className="w-5 h-5 rounded mt-0.5"
                        value={c}
                        checked={activeCompanies.has(c)}
                        onChange={(e) => onCompanyChange(c, e.target.checked)}
                    />
                    <Icon name="building-2" className="w-5 h-5 text-[var(--primary-light)] flex-shrink-0 mt-0.5" />
                    <span>{c}</span>
                </label>
            ))}
        </nav>
    </aside>
));
