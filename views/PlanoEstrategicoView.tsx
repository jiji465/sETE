import React, { useState, useEffect } from 'react';
import { planoData } from '../planoData';
import { Icon } from '../components/ui';

type PlanoSection = keyof typeof planoData;

const SubNavButton: React.FC<{
    target: PlanoSection;
    label: string;
    isActive: boolean;
    onClick: (target: PlanoSection) => void;
}> = ({ target, label, isActive, onClick }) => (
    <button
        onClick={() => onClick(target)}
        className={`sub-nav-button px-4 py-2.5 text-sm font-medium rounded-lg ${isActive ? 'active' : ''}`}
    >
        {label}
    </button>
);

const ContentCard: React.FC<{ title: string; items: string[] }> = ({ title, items }) => (
    <div className="content-card p-6">
        <h3 className="font-bold text-lg text-[var(--brand-dark-blue)] mb-4">{title}</h3>
        <ul className="space-y-3 text-[var(--text-secondary)]">
            {items.map((item, index) => (
                <li key={index}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
                    <span>{item}</span>
                </li>
            ))}
        </ul>
    </div>
);

const FlowChart: React.FC<{ steps: string[] }> = ({ steps }) => (
    <div className="flex items-stretch gap-2 sm:gap-4">
        {steps.map((step, index) => (
            <React.Fragment key={step}>
                <div className="flex-1 flow-step">{step}</div>
                {index < steps.length - 1 && (
                    <div className="flow-arrow">
                        <Icon name="arrow-right" className="w-6 h-6" />
                    </div>
                )}
            </React.Fragment>
        ))}
    </div>
);


export const PlanoEstrategicoView: React.FC = () => {
    const [activeSection, setActiveSection] = useState<PlanoSection>('financeiro');

    useEffect(() => {
        window.lucide.createIcons();
    }, [activeSection]);

    const currentData = planoData[activeSection];

    return (
        <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
            <nav className="flex flex-wrap gap-2 mb-8" aria-label="Plano Estratégico Navegação">
                <SubNavButton target="financeiro" label="Financeiro e Fiscal" isActive={activeSection === 'financeiro'} onClick={setActiveSection} />
                <SubNavButton target="estoque" label="Estoque e Custos" isActive={activeSection === 'estoque'} onClick={setActiveSection} />
                <SubNavButton target="vendas" label="Vendas e Clientes" isActive={activeSection === 'vendas'} onClick={setActiveSection} />
                <SubNavButton target="patrimonial" label="Patrimonial" isActive={activeSection === 'patrimonial'} onClick={setActiveSection} />
            </nav>

            <div className="animate-fade-in">
                <h2 className="text-3xl font-bold text-[var(--brand-dark-blue)] mb-2">{currentData.title}</h2>
                <p className="text-[var(--text-secondary)] mb-8 max-w-3xl">{currentData.description}</p>

                {'cards' in currentData && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {currentData.cards.map(card => <ContentCard key={card.title} {...card} />)}
                    </div>
                )}
                
                {'sections' in currentData && (
                    <div className="space-y-8">
                        {currentData.sections.map((section, index) => (
                            <div key={index} className="content-card p-6">
                                <h3 className="font-bold text-lg text-[var(--brand-dark-blue)] mb-2">{section.title}</h3>
                                <p className="text-[var(--text-secondary)] mb-6">{section.description}</p>
                                {section.type === 'flow' && <FlowChart steps={section.steps} />}
                                {section.type === 'card' && <ContentCard title="" items={section.items} />}
                                {'footer' in section && <p className="text-sm text-[var(--text-tertiary)] mt-4">{section.footer}</p>}
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};