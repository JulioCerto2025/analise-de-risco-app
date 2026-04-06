import React from 'react';
import { motion } from 'framer-motion';
import { Layers, BoxIcon, Zap, Shield, ExternalLink, Wrench, Globe } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '../ui';

export function ToolboxStep() {
    const tools = [
        {
            title: "Desenho Técnico 2D",
            subtitle: "PRANCHAS EXECUTIVAS",
            description: "Acesse detalhes executivos padronizados para seu projeto final.",
            url: "https://detalhes-executivos-spda.vercel.app/",
            icon: <Layers className="w-6 h-6 text-emerald-400" />,
            color: "emerald",
            gradient: "from-emerald-600 to-teal-600",
            shadow: "shadow-emerald-900/40"
        },
        {
            title: "Desenho Técnico 3D",
            subtitle: "MÉTODO ZPR",
            description: "Simulação interativa de volumes de proteção e esferas rolantes em 3D.",
            url: "https://esferas-rolantes-3d.vercel.app/",
            icon: <BoxIcon className="w-6 h-6 text-rose-400" />,
            color: "rose",
            gradient: "from-rose-600 to-pink-600",
            shadow: "shadow-rose-900/40"
        },
        {
            title: "Campos Eletromagnéticos",
            subtitle: "EFEITOS E SIMULAÇÕES",
            description: "Análise de impacto e radiação eletromagnética em instalações.",
            url: "https://efeitos-campo-eletromagnetico.vercel.app/",
            icon: <Zap className="w-6 h-6 text-blue-400" />,
            color: "blue",
            gradient: "from-blue-600 to-indigo-600",
            shadow: "shadow-blue-900/40"
        },
        {
            title: "Aterramento Subestação",
            subtitle: "NBR 15751",
            description: "Dimensionamento de malhas de aterramento para subestações.",
            url: "https://aterramento-sub-nbr15751.vercel.app/",
            icon: <Shield className="w-6 h-6 text-amber-400" />,
            color: "amber",
            gradient: "from-amber-600 to-orange-600",
            shadow: "shadow-amber-900/40"
        }
    ];

    return (
        <div className="space-y-4">
            <Card className="bg-slate-950/60 border-slate-800 shadow-2xl rounded-[2rem] overflow-hidden backdrop-blur-xl">
                <CardHeader className="bg-slate-900/40 border-b border-slate-800 p-4 lg:p-6">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-blue-600/20 border border-blue-500/30 flex items-center justify-center shadow-lg shrink-0">
                            <Wrench className="w-6 h-6 text-blue-400" />
                        </div>
                        <div>
                            <CardTitle className="text-lg lg:text-xl font-black text-white tracking-widest uppercase leading-none">Caixa de Ferramentas</CardTitle>
                            <p className="text-slate-400 text-[10px] lg:text-xs font-medium tracking-wide mt-1">Ecossistema de Soluções para Engenharia de Proteção</p>
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="p-4 lg:p-6 pb-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 lg:gap-4">
                        {tools.map((tool, index) => (
                            <motion.div
                                key={tool.title}
                                initial={{ opacity: 0, scale: 0.98 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: index * 0.05 }}
                                className={`group relative overflow-hidden rounded-2xl border border-${tool.color}-500/20 bg-slate-900/80 p-4 transition-all hover:border-${tool.color}-400/40 hover:shadow-lg flex flex-col`}
                            >
                                <div className="relative z-10 flex flex-col h-full">
                                    <div className="flex items-center gap-3 mb-2">
                                        <div className={`w-10 h-10 rounded-xl bg-${tool.color}-500/10 border border-${tool.color}-500/10 flex items-center justify-center group-hover:scale-105 transition-transform shrink-0`}>
                                            {tool.icon}
                                        </div>
                                        <div>
                                            <h3 className="text-sm font-black text-white tracking-tight uppercase leading-none">{tool.title}</h3>
                                            <p className={`text-${tool.color}-400 text-[8px] font-black tracking-[0.1em] mt-1 leading-none`}>{tool.subtitle}</p>
                                        </div>
                                    </div>
                                    
                                    <p className="text-slate-500 leading-tight mb-3 text-[11px] h-6 overflow-hidden line-clamp-2">
                                        {tool.description}
                                    </p>

                                    <a 
                                        href={tool.url} 
                                        target="_blank" 
                                        rel="noopener noreferrer" 
                                        className={`w-full py-2.5 rounded-xl bg-gradient-to-r ${tool.gradient} text-white font-black tracking-[0.15em] text-[10px] transition-all ${tool.shadow} flex items-center justify-center gap-2 active:scale-95 hover:brightness-110`}
                                    >
                                        <Globe className="w-3 h-3" /> 
                                        ABRIR FERRAMENTA
                                        <ExternalLink className="w-3 h-3 opacity-50" />
                                    </a>
                                </div>
                            </motion.div>
                        ))}
                    </div>

                    <div className="mt-4 py-2 border-t border-slate-800/50 text-center">
                        <p className="text-slate-600 text-[9px] font-bold uppercase tracking-[0.2em]">
                            Soluções integradas • NBR 5419 • NBR 15751
                        </p>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
