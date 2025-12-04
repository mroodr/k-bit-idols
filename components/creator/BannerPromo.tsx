// app/components/marketing/BannerPromo.tsx
'use client';

import { Sparkles, Music, Zap, Trophy } from 'lucide-react';
import { useState } from 'react';

export function BannerPromo() {
    const [isClosing, setIsClosing] = useState(false);

    const handleClose = () => {
        setIsClosing(true);
        setTimeout(() => {
            // En una app real, aquí guardarías en localStorage
        }, 300);
    };

    if (isClosing) return null;

    return (
        <div className="relative overflow-hidden rounded-2xl mb-8">
            {/* Fondo animado */}
            <div className="absolute inset-0 bg-gradient-to-r from-pink-500/20 via-purple-500/20 to-blue-500/20 animate-gradient" />

            {/* Patrón de grid */}
            <div className="absolute inset-0 pixel-grid opacity-10" />

            {/* Contenido */}
            <div className="relative z-10 p-8">
                <div className="flex flex-col lg:flex-row items-center justify-between">
                    {/* Texto principal */}
                    <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-4">
                            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-pink-500 to-purple-600 flex items-center justify-center">
                                <Trophy className="w-6 h-6 text-white" />
                            </div>
                            <div>
                                <h2 className="text-2xl font-bold">
                                    <span className="gradient-text">¡Base Hackathon 2024!</span>
                                </h2>
                                <p className="text-gray-300">Participa y gana premios en ETH</p>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
                            <div className="flex items-center space-x-2">
                                <Sparkles className="w-5 h-5 text-pink-400" />
                                <span className="text-sm">Creación con IA</span>
                            </div>
                            <div className="flex items-center space-x-2">
                                <Music className="w-5 h-5 text-purple-400" />
                                <span className="text-sm">Música generada</span>
                            </div>
                            <div className="flex items-center space-x-2">
                                <Zap className="w-5 h-5 text-blue-400" />
                                <span className="text-sm">Transacciones $0.01</span>
                            </div>
                            <div className="flex items-center space-x-2">
                                <div className="w-5 h-5 rounded-full bg-gradient-to-r from-pink-500 to-purple-500 flex items-center justify-center">
                                    <span className="text-xs font-bold">NFT</span>
                                </div>
                                <span className="text-sm">Propiedad real</span>
                            </div>
                        </div>
                    </div>

                    {/* CTA y close */}
                    <div className="flex flex-col items-end space-y-4 mt-6 lg:mt-0">
                        <button className="px-6 py-3 bg-gradient-to-r from-pink-600 to-purple-600 
                           text-white font-bold rounded-full hover:from-pink-700 
                           hover:to-purple-700 transition-all hover:scale-105 
                           shadow-lg hover:shadow-xl hover:shadow-pink-500/25">
                            🚀 Empezar a Crear
                        </button>

                        <button
                            onClick={handleClose}
                            className="text-sm text-gray-400 hover:text-white transition-colors"
                        >
                            Omitir promoción
                        </button>
                    </div>
                </div>

                {/* Timer/Ticker */}
                <div className="mt-6 pt-6 border-t border-white/10">
                    <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center space-x-2">
                            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                            <span className="text-gray-300">Demo activa para Hackathon</span>
                        </div>
                        <div className="flex items-center space-x-4">
                            <div className="text-right">
                                <div className="text-lg font-bold gradient-text">Gratis</div>
                                <div className="text-xs text-gray-400">15s de demo</div>
                            </div>
                            <div className="text-right">
                                <div className="text-lg font-bold gradient-text">0.001 ETH</div>
                                <div className="text-xs text-gray-400">Mint completo</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}