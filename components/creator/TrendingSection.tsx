// components/trending/TrendingSection.tsx
'use client';

import { TrendingUp, Flame, Users, Rocket } from 'lucide-react';

const trendingItems = [
    {
        rank: 1,
        name: 'AI Generated: "Starlight"',
        creator: '@kpopfan92',
        mints: '124',
        trend: '+32%',
        icon: Flame,
        color: 'from-red-500 to-orange-500',
    },
    {
        rank: 2,
        name: 'Virtual Group: Neon Angels',
        creator: '@crypto_artist',
        mints: '89',
        trend: '+18%',
        icon: Rocket,
        color: 'from-blue-500 to-purple-500',
    },
    {
        rank: 3,
        name: 'Pixel Art Collection',
        creator: '@retro_gamer',
        mints: '67',
        trend: '+45%',
        icon: TrendingUp,
        color: 'from-green-500 to-teal-500',
    },
    {
        rank: 4,
        name: 'K-Pop x AI Collab',
        creator: '@music_producer',
        mints: '56',
        trend: '+12%',
        icon: Users,
        color: 'from-pink-500 to-rose-500',
    },
];

export function TrendingSection() {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {trendingItems.map((item) => {
                const Icon = item.icon;
                return (
                    <div
                        key={item.rank}
                        className="bg-gradient-to-br from-gray-900/50 to-black/50 
                     rounded-xl p-5 border border-gray-800/50 hover:border-gray-700 
                     transition-all hover:scale-[1.02] cursor-pointer"
                    >
                        <div className="flex items-start justify-between">
                            <div className="flex items-center space-x-4">
                                {/* Rank */}
                                <div className="relative">
                                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${item.color} 
                               flex items-center justify-center`}>
                                        <span className="text-xl font-bold">{item.rank}</span>
                                    </div>
                                    <Icon className="absolute -top-2 -right-2 w-6 h-6 text-white" />
                                </div>

                                {/* Info */}
                                <div>
                                    <h4 className="font-bold text-white">{item.name}</h4>
                                    <p className="text-sm text-gray-400">{item.creator}</p>
                                    <div className="flex items-center space-x-4 mt-2">
                                        <span className="text-xs px-2 py-1 bg-gray-800 rounded-full">
                                            {item.mints} mints
                                        </span>
                                        <span className="text-xs text-green-400 font-medium">
                                            {item.trend} esta semana
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* Mint Button */}
                            <button className="px-4 py-2 bg-gradient-to-r from-gray-800 to-gray-900 
                               text-white text-sm rounded-full hover:from-gray-700 
                               hover:to-gray-800 transition-all border border-gray-700">
                                Mintear
                            </button>
                        </div>
                    </div>
                );
            })}

            {/* Stats */}
            <div className="md:col-span-2 bg-gray-900/30 rounded-xl p-6 mt-4">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                    <div className="text-center">
                        <div className="text-3xl font-bold gradient-text">1,234</div>
                        <p className="text-sm text-gray-400">Idols creados</p>
                    </div>
                    <div className="text-center">
                        <div className="text-3xl font-bold gradient-text">5.6K</div>
                        <p className="text-sm text-gray-400">Mints totales</p>
                    </div>
                    <div className="text-center">
                        <div className="text-3xl font-bold gradient-text">892</div>
                        <p className="text-sm text-gray-400">Creadores activos</p>
                    </div>
                    <div className="text-center">
                        <div className="text-3xl font-bold gradient-text">24.7</div>
                        <p className="text-sm text-gray-400">ETH volume</p>
                    </div>
                </div>
            </div>
        </div>
    );
}