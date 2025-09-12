import React, { useState, useEffect } from 'react';
import { Icon } from './ui';

interface KpiCardProps {
    title: string;
    value: string;
    icon: string;
    iconColorClass: string;
}

export const KpiCard: React.FC<KpiCardProps> = React.memo(({ title, value, icon, iconColorClass }) => {
    const [displayValue, setDisplayValue] = useState(value);
    const [isUpdating, setIsUpdating] = useState(false);

    useEffect(() => {
        if (value !== displayValue) {
            setIsUpdating(true);
            const timeoutId = setTimeout(() => {
                setDisplayValue(value);
                setIsUpdating(false);
            }, 10);
            return () => clearTimeout(timeoutId);
        }
    }, [value, displayValue]);

    return (
        <div className="kpi-card p-5 flex flex-col">
            <div className="flex items-center justify-between">
                <h3 className="font-semibold text-[var(--text-secondary)] uppercase text-xs tracking-wider">{title}</h3>
                <div className={`p-2 rounded-md bg-opacity-10 ${iconColorClass.replace('text-', 'bg-')}`}>
                    <Icon name={icon} className={`${iconColorClass} w-5 h-5`} />
                </div>
            </div>
            <div className="mt-2 flex-1 flex items-end">
                <p className={`kpi-value font-bold text-[var(--text-primary)] ${isUpdating ? 'kpi-value-update' : ''}`}>{displayValue}</p>
            </div>
        </div>
    );
});
