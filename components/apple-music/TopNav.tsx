// components/apple-music/TopNav.tsx
'use client';

import { Search, SkipBack, SkipForward, Play, Pause, Volume2, Music } from 'lucide-react';
import { useState, useRef } from 'react';

export function TopNav() {
    const [searchQuery, setSearchQuery] = useState('');
    const [isPlaying, setIsPlaying] = useState(false);
    const [userInput, setUserInput] = useState('');

    return (
        <header className="bg-white border-b border-gray-200 px-6 py-4 sticky top-0 z-30">
            <div className="flex items-center justify-between">
                {/* Logo y Controles de Reproducción */}
                <div className="flex items-center gap-6">
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                            <Music className="text-white" size={18} />
                        </div>
                        <span className="text-xl font-semibold">Music</span>
                    </div>
                    
                    {/* Controles de reproducción */}
                    <div className="flex items-center gap-2">
                        <button className="w-8 h-8 flex items-center justify-center hover:bg-gray-100 rounded-full transition-colors">
                            <SkipBack size={18} className="text-gray-700" />
                        </button>
                        <button 
                            onClick={() => setIsPlaying(!isPlaying)}
                            className="w-10 h-10 flex items-center justify-center bg-black text-white rounded-full hover:bg-gray-800 transition-colors"
                        >
                            {isPlaying ? <Pause size={20} /> : <Play size={20} className="ml-0.5" />}
                        </button>
                        <button className="w-8 h-8 flex items-center justify-center hover:bg-gray-100 rounded-full transition-colors">
                            <SkipForward size={18} className="text-gray-700" />
                        </button>
                        <button className="w-8 h-8 flex items-center justify-center hover:bg-gray-100 rounded-full transition-colors">
                            <Volume2 size={18} className="text-gray-700" />
                        </button>
                    </div>
                </div>

                {/* Barra de búsqueda prominente */}
                <div className="flex-1 max-w-2xl mx-8">
                    <div className="relative">
                        <div className="absolute left-3 top-1/2 -translate-y-1/2 flex items-center gap-2">
                            <Search className="text-gray-400" size={18} />
                            <span className="text-xs text-gray-400">music.apple.com</span>
                        </div>
                        <input
                            type="text"
                            value={userInput}
                            onChange={(e) => setUserInput(e.target.value)}
                            placeholder="Busca sólo en tu biblioteca o en todo el catálogo de Apple Music."
                            className="w-full bg-gray-100 border border-gray-300 rounded-full pl-32 pr-4 py-2.5 text-sm focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all placeholder:text-gray-400"
                        />
                    </div>
                </div>

                {/* User Actions */}
                <div className="flex items-center space-x-4">
                    <button className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center hover:bg-gray-400 transition-colors">
                        <div className="w-4 h-4 rounded-full bg-gray-600" />
                    </button>
                </div>
            </div>
        </header>
    );
}
