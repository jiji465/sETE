import type { RawDebtItem, InstallmentDetails } from './types';
import { parseNumericValue } from './hooks/useDebts';

export const formatCurrency = (value: number) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);

export const parseDate = (d: string): Date | null => {
    if (typeof d !== 'string' || !d.trim()) return null;
    const cleanedDateStr = d.trim();
    const parts = cleanedDateStr.split('/');
    if (parts.length !== 3) return null;

    const [month, day, yearStr] = parts;
    let year = parseInt(yearStr, 10);
    if (year < 100) { year += 2000; }
    
    const date = new Date(year, parseInt(month, 10) - 1, parseInt(day, 10));
    if (isNaN(date.getTime()) || date.getFullYear() !== year) return null;
    return date;
};

export const formatDate = (date: Date | null): string => {
    if (!date) return 'N/A';
    return date.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' });
}

export const formatCompetencia = (competenciaStr: string): string => {
    if (typeof competenciaStr !== 'string') return competenciaStr;
    const monthMap: { [key: string]: string } = { 'jan': '01', 'feb': '02', 'mar': '03', 'apr': '04', 'may': '05', 'jun': '06', 'jul': '07', 'aug': '08', 'sep': '09', 'oct': '10', 'nov': '11', 'dec': '12' };
    const match = competenciaStr.toLowerCase().match(/([a-z]{3})-?(\d{2})/);
    if (match) {
        const month = monthMap[match[1]];
        const year = `20${match[2]}`;
        if (month) return `${month}/${year}`;
    }
    return competenciaStr;
};

export const extractType = (name: string): string => {
    if (typeof name !== 'string') return 'Outro';
    const lowerName = name.toLowerCase();
    if (lowerName.includes('irpj')) return 'IRPJ';
    if (lowerName.includes('csll')) return 'CSLL';
    if (lowerName.includes('pis')) return 'PIS';
    if (lowerName.includes('cofins')) return 'COFINS';
    if (lowerName.includes('iss')) return 'ISS';
    if (lowerName.includes('parcelamento')) return 'Parcelamento';
    if (lowerName.includes('fgts')) return 'FGTS';
    if (lowerName.includes('iof')) return 'IOF';
    if (lowerName.includes('contribuições')) return 'Folha';
    return 'Outro';
};

export const parseInstallmentDetails = (row: RawDebtItem): InstallmentDetails => {
    const competenceRegex = /(\d+)\/(\d+)/;
    const totalValueRegex = /valor total R\$ ([\d.,]+)/i;
    const balanceRegex = /saldo devedor ([\d.,]+)/i;
    const competenceMatch = row['Competência']?.match(competenceRegex);
    const totalValueMatch = row['Nome do Débito']?.match(totalValueRegex);
    const balanceMatch = row['Nome do Débito']?.match(balanceRegex) || row.Column10?.match(balanceRegex);
    return {
        paidCount: competenceMatch ? parseInt(competenceMatch[1]) : null,
        totalCount: competenceMatch ? parseInt(competenceMatch[2]) : null,
        totalValue: totalValueMatch ? parseNumericValue(totalValueMatch[1]) : null,
        remainingBalance: balanceMatch ? parseNumericValue(balanceMatch[1]) : null,
    };
};

export const getCssVar = (varName: string) => getComputedStyle(document.documentElement).getPropertyValue(varName).trim();
