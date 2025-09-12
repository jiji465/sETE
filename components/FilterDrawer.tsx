import React, { useState, useEffect, useRef } from 'react';
import type { FilterState } from '../types';
import { Icon } from './ui';

const CustomMultiSelect: React.FC<{
  options: string[];
  selected: string[];
  onChange: (selected: string[]) => void;
  placeholder: string;
}> = ({ options, selected, onChange, placeholder }) => {
    const [isOpen, setIsOpen] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleOptionToggle = (option: string) => {
        const newSelected = selected.includes(option)
            ? selected.filter(item => item !== option)
            : [...selected, option];
        onChange(newSelected);
    };

    return (
        <div ref={containerRef} className={`custom-select-container ${isOpen ? 'open' : ''}`}>
            <button onClick={() => setIsOpen(o => !o)} className="custom-select-trigger" type="button" aria-haspopup="listbox" aria-expanded={isOpen}>
                <span className="truncate pr-2">{selected.length > 0 ? selected.join(', ') : placeholder}</span>
                <Icon name="chevrons-up-down" className="w-4 h-4 text-gray-400 flex-shrink-0" />
            </button>
            <div className="custom-select-options" role="listbox">
                {options.map(option => (
                    <label key={option} className="custom-select-option">
                        <input
                            type="checkbox"
                            className="w-4 h-4 rounded"
                            checked={selected.includes(option)}
                            onChange={() => handleOptionToggle(option)}
                        />
                        <span>{option}</span>
                    </label>
                ))}
            </div>
        </div>
    );
};

interface FilterDrawerProps {
    isOpen: boolean;
    onClose: () => void;
    tempFilters: FilterState;
    setTempFilters: (key: keyof FilterState, value: any) => void;
    allSituacoes: string[];
    allTipos: string[];
    allCompanies: string[];
    tempCompanies: Set<string>;
    setTempCompanies: (companies: Set<string>) => void;
    onApply: () => void;
    onClear: () => void;
}

export const FilterDrawer: React.FC<FilterDrawerProps> = ({ isOpen, onClose, tempFilters, setTempFilters, allSituacoes, allTipos, allCompanies, tempCompanies, setTempCompanies, onApply, onClear }) => {
    return (
        <>
            <div className={`filter-overlay fixed inset-0 z-40 ${isOpen ? 'open' : ''}`} onClick={onClose}></div>
            <div className={`filter-drawer fixed top-0 right-0 h-full w-full max-w-sm bg-[var(--card-bg)] shadow-lg z-50 p-6 flex flex-col ${isOpen ? 'open' : ''}`}>
                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-lg font-bold">Filtros Avançados</h3>
                    <button onClick={onClose} className="p-1 rounded-full hover:bg-[var(--primary-bg)]"><Icon name="x" className="w-5 h-5" /></button>
                </div>
                <div className="flex-1 space-y-6 overflow-y-auto pr-3 -mr-3">
                    <div className="space-y-4">
                        <h4 className="text-xs font-bold uppercase text-[var(--text-secondary)] tracking-wider flex items-center gap-2">
                            <Icon name="calendar-range" className="w-4 h-4" />
                            <span>Período de Vencimento</span>
                        </h4>
                        <div>
                            <label htmlFor="startDate" className="block text-sm font-medium mb-1.5">De</label>
                            <input id="startDate" type="date" value={tempFilters.startDate} onChange={e => setTempFilters('startDate', e.target.value)} className="filter-input w-full px-3 py-2" />
                        </div>
                        <div>
                            <label htmlFor="endDate" className="block text-sm font-medium mb-1.5">Até</label>
                            <input id="endDate" type="date" value={tempFilters.endDate} onChange={e => setTempFilters('endDate', e.target.value)} className="filter-input w-full px-3 py-2" />
                        </div>
                    </div>

                    <hr className="border-[var(--border-color)]" />

                    <div className="space-y-4">
                        <h4 className="text-xs font-bold uppercase text-[var(--text-secondary)] tracking-wider flex items-center gap-2">
                            <Icon name="list-filter" className="w-4 h-4" />
                            <span>Critérios</span>
                        </h4>
                        <div>
                            <label className="block text-sm font-medium mb-1.5">Empresa</label>
                            <CustomMultiSelect 
                                options={allCompanies} 
                                selected={Array.from(tempCompanies)} 
                                onChange={s => setTempCompanies(new Set(s))} 
                                placeholder="Todas as empresas" 
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1.5">Situação do Débito</label>
                            <CustomMultiSelect options={allSituacoes} selected={tempFilters.situacoes} onChange={s => setTempFilters('situacoes', s)} placeholder="Todas as situações" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1.5">Tipo de Débito</label>
                            <CustomMultiSelect options={allTipos} selected={tempFilters.tipos} onChange={t => setTempFilters('tipos', t)} placeholder="Todos os tipos" />
                        </div>
                    </div>
                </div>
                <div className="mt-6 flex gap-3 border-t border-[var(--border-color)] pt-4">
                    <button onClick={onClear} className="w-full py-2.5 px-4 rounded-lg border border-[var(--border-color)] font-semibold hover:bg-[var(--subtle-bg)] transition">Limpar Filtros</button>
                    <button onClick={onApply} className="w-full py-2.5 px-4 rounded-lg bg-[var(--primary-fg)] text-[var(--brand-dark-blue)] font-semibold hover:bg-[var(--primary-dark)] transition">Aplicar</button>
                </div>
            </div>
        </>
    );
};
