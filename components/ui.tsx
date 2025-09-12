import React from 'react';

export const Icon: React.FC<{ name: string; className?: string }> = ({ name, className }) => (
    <i data-lucide={name} className={className}></i>
);

export const LoadingOverlay: React.FC<{ show: boolean }> = React.memo(({ show }) => (
    <div className={`loading-overlay ${show ? 'show' : ''}`}>
        <div className="spinner"></div>
    </div>
));

export const Logo: React.FC<{ className?: string }> = ({ className }) => (
    <div className={`logo-set-container text-center ${className}`}>
        <div className="logo-set-main text-5xl">SETE</div>
        <div className="logo-set-sub">Soluções Fiscais</div>
    </div>
);
