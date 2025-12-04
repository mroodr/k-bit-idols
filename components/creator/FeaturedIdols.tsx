// components/collection/FeaturedIdols.tsx
'use client';

import { Play, Heart, MoreVertical } from 'lucide-react';
import Image from 'next/image';

const featuredIdols = [
    {
        id: 1,
        name: 'Cyber Nova',
        group: 'Pixel Dreams',
        plays: '1.2K',
        likes: '245',
        image: '/placeholder-idol-1.jpg',
        color: 'from-pink-500 to-purple-600',
    },
    {
        id: 2,
        name: 'Neon Blossom',
        group: 'Digital Bloom',
        plays: '890',
        likes: '189',
        image: '/placeholder-idol-2.jpg',
        color: 'from-blue-500 to-cyan-600',
    },
    {
        id: 3,
        name: 'Retro Glitch',
        group: '8-Bit Hearts',
        plays: '1.5K',
        likes: '312',
        image: '/placeholder-idol-3.jpg',
        color: 'from-green-500 to-teal-600',
    },
    {
        id: 4,
        name: 'Quantum Star',
        group: 'Future Waves',
        plays: '2.1K',
        likes: '456',
        image: '/placeholder-idol-4.jpg',
        color: 'from-orange-500 to-red-600',
    },
];

export function FeaturedIdols() {
    return (
        <div className="space-y-4">
            {featuredIdols.map((idol) => (
                <div
                    key={idol.id}
                    className="group bg-gray-900/50 hover:bg-gray-800/50 rounded-xl p-4 
                   transition-all duration-300 cursor-pointer border border-gray-800/50"
                >
                    <div className="flex items-center space-x-4">
                        {/* Imagen/Placeholder */}
                        <div className="relative">
                            <div
                                className={`w-16 h-16 rounded-lg bg-gradient-to-br ${idol.color} 
                         flex items-center justify-center`}
                            >
                                <div className="w-12 h-12 rounded bg-black/30 flex items-center justify-center">
                                    <span className="text-xs font-bold">IDOL</span>
                                </div>
                            </div>
                            <button className="absolute bottom-0 right-0 w-6 h-6 bg-black/80 
                               rounded-full flex items-center justify-center 
                               opacity-0 group-hover:opacity-100 transition-opacity">
                                <Play className="w-3 h-3 text-white" />
                            </button>
                        </div>

                        {/* Info */}
                        <div className="flex-1">
                            <h4 className="font-bold text-white group-hover:text-pink-400 transition-colors">
                                {idol.name}
                            </h4>
                            <p className="text-sm text-gray-400">{idol.group}</p>
                            <div className="flex items-center space-x-4 mt-2 text-xs text-gray-500">
                                <span>{idol.plays} plays</span>
                                <span>•</span>
                                <span>{idol.likes} likes</span>
                            </div>
                        </div>

                        {/* Acciones */}
                        <div className="flex items-center space-x-2">
                            <button className="p-2 hover:bg-gray-800 rounded-full transition-colors">
                                <Heart className="w-4 h-4 text-gray-400 hover:text-pink-500" />
                            </button>
                            <button className="p-2 hover:bg-gray-800 rounded-full transition-colors">
                                <MoreVertical className="w-4 h-4 text-gray-400" />
                            </button>
                        </div>
                    </div>
                </div>
            ))}

            {/* Ver todos */}
            <button className="w-full py-3 text-center text-gray-400 hover:text-white 
                       border border-dashed border-gray-800 rounded-xl 
                       hover:border-gray-700 transition-colors">
                Ver todos mis Idols →
            </button>
        </div>
    );
}