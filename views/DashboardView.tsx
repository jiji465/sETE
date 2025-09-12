import React, { useState, useEffect } from 'react';
import { useDebts } from '../hooks/useDebts';
import { Sidebar } from '../components/Sidebar';
import { Header } from '../components/Header';
import { KpiCard } from '../components/KpiCard';
import { ChartsSection } from '../components/ChartsSection';
import { DebtTable } from '../components/DebtTable';
import { FilterDrawer } from '../components/FilterDrawer';
import { BulkActionBar } from '../components/BulkActionBar';
import { QuickFilters } from '../components/QuickFilters';
import { LoadingOverlay, Icon } from '../components/ui';
import { formatCurrency } from '../utils';

export const DashboardView: React.FC = () => {
    const {
        state,
        dispatch,
        kpis,
        paginatedData,
        sortedData,
        filteredData,
        allCompanies,
        allSituacoes,
        allTipos,
    } = useDebts();

    const [isSidebarOpen, setSidebarOpen] = useState(false);
    const [isFilterDrawerOpen, setFilterDrawerOpen] = useState(false);
    
    useEffect(() => {
        if (window.lucide) {
            window.lucide.createIcons();
        }
    }, [
      state.pagination, 
      isSidebarOpen, 
      isFilterDrawerOpen, 
      state.expandedRows, 
      state.isLoading, 
      state.selectedRows, 
      paginatedData
    ]);
    
    const handleApplyFilters = () => {
        dispatch({ type: 'APPLY_TEMP_FILTERS' });
        setFilterDrawerOpen(false);
    };
    
    const openFilterDrawer = () => {
        dispatch({ type: 'SYNC_FILTERS_TO_TEMP' });
        setFilterDrawerOpen(true);
    };

    return (
        <div className="flex h-full bg-[var(--background)]">
            <LoadingOverlay show={state.isLoading} />
            <Sidebar 
                isOpen={isSidebarOpen} 
                allCompanies={allCompanies} 
                activeCompanies={state.activeCompanies} 
                onCompanyChange={(company, isChecked) => dispatch({ type: 'TOGGLE_COMPANY', payload: { company, isChecked }})} 
                onToggleAll={(isChecked) => dispatch({ type: 'TOGGLE_ALL_COMPANIES', payload: isChecked })}
            />
            <div className="flex-1 flex flex-col h-full lg:ml-72">
                <main className="flex-1 p-4 sm:p-6 lg:p-8">
                    <section className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6 mb-8">
                        <KpiCard title="Dívida Ativa" value={formatCurrency(kpis.totalDebt)} icon="landmark" iconColorClass="text-[var(--primary-light)]" />
                        <KpiCard title="Dívida Vencida" value={formatCurrency(kpis.overdueDebt)} icon="siren" iconColorClass="text-[var(--danger)]" />
                        <KpiCard title="A Vencer" value={formatCurrency(kpis.upcomingDebt)} icon="calendar-check" iconColorClass="text-[var(--warning)]" />
                        <KpiCard title="Débitos Filtrados" value={kpis.totalDebtsCount.toString()} icon="file-stack" iconColorClass="text-[var(--success)]" />
                    </section>

                    <ChartsSection data={filteredData} onTipoFilter={(tipo) => dispatch({ type: 'SET_CHART_TIPO_FILTER', payload: tipo })} />
                    
                    <div className="bg-[var(--card-bg)] p-4 rounded-t-xl border border-b-0 border-[var(--border-color)] flex flex-col gap-4">
                        <div className="flex flex-wrap items-center justify-between gap-4">
                            <div className="flex-1 min-w-[250px] relative">
                                <input type="text" placeholder="Buscar por empresa ou débito..." className="filter-input w-full pl-10 pr-4 py-2" value={state.filters.search} onChange={e => dispatch({ type: 'SET_FILTER', payload: { key: 'search', value: e.target.value }})} />
                                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-tertiary)]"><Icon name="search" className="w-5 h-5" /></div>
                            </div>
                             <div className="flex items-center gap-3">
                                <button onClick={() => dispatch({ type: 'REFRESH_DATA' })} className="p-2 bg-[var(--primary-bg)] text-[var(--brand-dark-blue)] rounded-lg hover:bg-[var(--primary-bg-hover)] transition tooltip" data-tooltip="Atualizar dados" aria-label="Atualizar dados">
                                    <Icon name="refresh-cw" className="w-5 h-5 text-[var(--primary-fg)]" />
                                </button>
                                <div className="relative">
                                    <button onClick={openFilterDrawer} className="bg-[var(--primary-bg)] text-[var(--brand-dark-blue)] px-4 py-2 rounded-lg font-medium transition-all duration-200 flex items-center gap-2 hover:bg-[var(--primary-bg-hover)]">
                                        <Icon name="filter" className="w-4 h-4" />
                                        <span>Filtros</span>
                                    </button>
                                    {kpis.activeFilterCount > 0 && <span className="filter-badge flex items-center justify-center rounded-full">{kpis.activeFilterCount}</span>}
                                </div>
                             </div>
                        </div>
                         <QuickFilters
                            selectedSituacoes={state.filters.situacoes}
                            onFilterChange={(situacoes) => dispatch({ type: 'SET_FILTER', payload: { key: 'situacoes', value: situacoes }})}
                        />
                    </div>
                    <DebtTable 
                        data={paginatedData} 
                        sort={state.sort} 
                        onSort={(key) => dispatch({ type: 'SET_SORT', payload: key })} 
                        pagination={state.pagination} 
                        setPagination={(pagination) => dispatch({ type: 'SET_PAGINATION', payload: pagination })} 
                        totalItems={sortedData.length} 
                        expandedRows={state.expandedRows} 
                        onToggleRow={(id) => dispatch({ type: 'TOGGLE_EXPAND_ROW', payload: id })}
                        selectedRows={state.selectedRows}
                        onToggleSelectRow={(id) => dispatch({ type: 'TOGGLE_SELECT_ROW', payload: id })}
                        onToggleSelectAll={() => dispatch({ type: 'TOGGLE_SELECT_ALL_ON_PAGE', payload: paginatedData.map(d => d.id) })}
                    />
                </main>
            </div>
            <FilterDrawer 
                isOpen={isFilterDrawerOpen} 
                onClose={() => setFilterDrawerOpen(false)} 
                tempFilters={state.tempFilters}
                setTempFilters={(key, value) => dispatch({ type: 'SET_TEMP_FILTER', payload: { key, value } })}
                allSituacoes={allSituacoes} 
                allTipos={allTipos} 
                allCompanies={allCompanies} 
                tempCompanies={state.tempActiveCompanies} 
                setTempCompanies={(companies) => dispatch({ type: 'SET_TEMP_COMPANIES', payload: companies })}
                onApply={handleApplyFilters} 
                onClear={() => dispatch({ type: 'CLEAR_TEMP_FILTERS' })}
            />
            <BulkActionBar 
                selectedCount={state.selectedRows.size} 
                onAction={(action) => dispatch({ type: 'BULK_ACTION', payload: action })}
                onClear={() => dispatch({ type: 'SET_SELECTED_ROWS', payload: new Set() })}
            />
        </div>
    );
};