import React, { useRef, useEffect } from 'react';
import type { DebtItem } from '../types';
import { formatCurrency, getCssVar } from '../utils';

interface ChartsSectionProps {
    data: DebtItem[];
    onTipoFilter: (tipo: string | null) => void;
}

export const ChartsSection: React.FC<ChartsSectionProps> = React.memo(({ data, onTipoFilter }) => {
    const debtByTypeChartRef = useRef<any>(null);
    const debtByCompanyChartRef = useRef<any>(null);

    useEffect(() => {
        const textColor = getCssVar('--text-secondary');
        const gridColor = getCssVar('--border-color');

        // Chart 1: Debt by Type (Donut)
        const byType = data.reduce((acc, item) => {
            acc[item.tipo] = (acc[item.tipo] || 0) + item.valor;
            return acc;
        }, {} as Record<string, number>);
        
        const typeLabels = Object.keys(byType);
        const typeData = Object.values(byType);
        const typeColors = [getCssVar('--brand-gem-yellow'), getCssVar('--brand-gold'), '#3b82f6', '#8b5cf6', '#ec4899', '#ef4444', '#22c55e'];
        
        const typeCtx = document.getElementById('debtByTypeChart') as HTMLCanvasElement;
        if (!typeCtx) return;
        if (debtByTypeChartRef.current) debtByTypeChartRef.current.destroy();
        debtByTypeChartRef.current = new Chart(typeCtx, {
            type: 'doughnut',
            data: { labels: typeLabels, datasets: [{ data: typeData, backgroundColor: typeColors, borderColor: getCssVar('--card-bg'), borderWidth: 4 }] },
            options: {
                responsive: true, maintainAspectRatio: false,
                plugins: {
                    legend: { position: 'right', labels: { color: textColor, boxWidth: 12, padding: 15 } },
                    tooltip: { callbacks: { label: (context: any) => `${context.label}: ${formatCurrency(context.raw as number)}` } }
                },
                onClick: (_, elements) => {
                    if (elements.length > 0) {
                        const clickedLabel = typeLabels[elements[0].index];
                        onTipoFilter(clickedLabel);
                    }
                }
            }
        });

        // Chart 2: Debt by Company (Bar)
        const byCompany = data.reduce((acc, item) => {
            acc[item.empresa] = (acc[item.empresa] || 0) + item.valor;
            return acc;
        }, {} as Record<string, number>);
        
        const companyLabels = Object.keys(byCompany);
        const companyData = Object.values(byCompany);

        const companyCtx = document.getElementById('debtByCompanyChart') as HTMLCanvasElement;
        if (!companyCtx) return;
        if (debtByCompanyChartRef.current) debtByCompanyChartRef.current.destroy();
        debtByCompanyChartRef.current = new Chart(companyCtx, {
            type: 'bar',
            data: {
                labels: companyLabels,
                datasets: [{
                    label: 'Dívida Total',
                    data: companyData,
                    backgroundColor: getCssVar('--brand-gold'),
                    borderRadius: 4,
                }]
            },
            options: {
                indexAxis: 'y', responsive: true, maintainAspectRatio: false,
                plugins: {
                    legend: { display: false },
                    tooltip: { callbacks: { label: (context: any) => formatCurrency(context.raw as number) } }
                },
                scales: {
                    x: { ticks: { color: textColor }, grid: { color: gridColor } },
                    y: { ticks: { color: textColor }, grid: { display: false } }
                }
            }
        });

    }, [data, onTipoFilter]);

    return (
        <section className="grid grid-cols-1 lg:grid-cols-5 gap-6 mb-8">
            <div className="lg:col-span-2 chart-card flex flex-col">
                <div className="flex justify-between items-center">
                    <h3 className="font-bold">Dívida por Tipo</h3>
                    <button onClick={() => onTipoFilter(null)} className="text-xs text-[var(--brand-dark-blue)] font-semibold hover:underline">Limpar</button>
                </div>
                <div className="relative flex-1 min-h-[300px] mt-4"><canvas id="debtByTypeChart"></canvas></div>
            </div>
            <div className="lg:col-span-3 chart-card flex flex-col">
                <h3 className="font-bold">Dívida por Empresa</h3>
                <div className="relative flex-1 min-h-[300px] mt-4"><canvas id="debtByCompanyChart"></canvas></div>
            </div>
        </section>
    );
});
