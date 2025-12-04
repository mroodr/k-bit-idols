// components/apple-music/QuickActions.tsx
'use client';

import { Bolt, Star, TrendingUp, Zap } from 'lucide-react';

export function QuickActions() {
    const actions = [
        {
            label: 'Rápido',
            icon: Bolt,
            description: 'Generar en 15s',
            color: 'from-yellow-500 to-orange-500',
        },
        {
            label: 'Trending',
            icon: TrendingUp,
            description: 'Estilo viral',
            color: 'from-green-500 to-teal-500',
        },
        {
            label: 'Premium',
            icon: Star,
            description: 'Alta calidad',
            color: 'from-purple-500 to-pink-500',
        },
        {
            label: 'Express',
            icon: Zap,
            description: '1-click',
            color: 'from-blue-500 to-cyan-500',
        },
    ];

    return (
        <div className="flex items-center space-x-4">
            <span className="text-sm text-gray-400">Acciones rápidas:</span>
            <div className="flex space-x-2">
                {actions.map((action) => {
                    const Icon = action.icon;
                    return (
                        <button
                            key={action.label}
                            className={`group relative px-4 py-2 rounded-full bg-gradient-to-r ${action.color} 
                       text-white font-medium hover:scale-105 transition-transform`}
                        >
                            <div className="flex items-center space-x-2">
                                <Icon className="w-4 h-4" />
                                <span className="text-sm">{action.label}</span>
                            </div>
                            <div className="absolute bottom-full mb-2 hidden group-hover:block 
                            bg-gray-900 text-white text-xs rounded-lg px-3 py-2 
                            whitespace-nowrap shadow-xl border border-gray-800">
                                {action.description}
                            </div>
                        </button>
                    );
                })}
            </div>
        </div>
    );
}