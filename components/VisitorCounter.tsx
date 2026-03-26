import React, { useEffect, useState } from 'react';

export const VisitorCounter: React.FC = () => {
    const [count, setCount] = useState<number | null>(null);

    useEffect(() => {
        const fetchCount = async () => {
            try {
                // Fetch increment / get
                const response = await fetch('/api/counter', {
                    headers: { 'cache-control': 'no-cache' }
                });
                if (response.ok) {
                    const data = await response.json();
                    setCount(data.count);
                }
            } catch (err) {
                // Silencioso se der erro (não atrapalha o app)
                console.warn('Visitor counter not available');
            }
        };

        fetchCount();
    }, []);

    // Se estiver carregando ou der erro, não exibe nada (discreto)
    if (count === null) return null;

    return (
        <div 
            className="fixed bottom-3 right-3 z-[999] px-2 py-1 rounded-md bg-black/30 backdrop-blur-md border border-slate-700/50 flex items-center gap-2 group transition-all hover:bg-black/50 select-none cursor-default"
            title="Acessos únicos por IP (conforme NBR 5419:2025 - Analítica)"
        >
            <div className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />
            <span className="text-[10px] font-medium text-slate-400 font-mono tracking-tight leading-none pt-0.5">
                IPS: <span className="text-blue-300">{count}</span>
            </span>
        </div>
    );
};
