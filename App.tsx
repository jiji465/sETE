import React, { useState, useEffect } from 'react';
import { PlanoEstrategicoView } from './views/PlanoEstrategicoView';
import { DashboardView } from './views/DashboardView';
import { Logo } from './components/ui';

type View = 'plano' | 'dashboard';

const App: React.FC = () => {
    const [activeView, setActiveView] = useState<View>('plano');

    useEffect(() => {
        // Ensure lucide icons are created when the app loads
        if (window.lucide) {
            window.lucide.createIcons();
        }
    }, []);

    const NavButton: React.FC<{ view: View; label: string }> = ({ view, label }) => (
        <button
            onClick={() => setActiveView(view)}
            className={`main-nav-button h-full flex items-center px-3 text-sm font-medium ${activeView === view ? 'active' : ''}`}
        >
            {label}
        </button>
    );

    return (
        <div className="flex flex-col h-screen bg-[var(--background)]">
            <header className="app-header border-b border-[var(--border-color)] px-4 sm:px-6 lg:px-8 flex justify-between items-center sticky top-0 z-30 shrink-0 h-16">
                <Logo className="scale-75 -ml-4" />
                <nav className="flex items-center gap-4 h-full">
                    <NavButton view="plano" label="Plano Estratégico" />
                    <NavButton view="dashboard" label="Dashboard Fiscal" />
                </nav>
            </header>
            
            <div className="flex-1 overflow-y-auto">
                {activeView === 'plano' && <PlanoEstrategicoView />}
                {activeView === 'dashboard' && <DashboardView />}
            </div>
        </div>
    );
};

export default App;