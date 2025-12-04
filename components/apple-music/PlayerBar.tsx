// components/apple-music/PlayerBar.tsx
'use client';

// SE AGREGÓ "Music" A LA LISTA DE IMPORTS AQUÍ ABAJO:
import { Play, Pause, SkipBack, SkipForward, Volume2, VolumeX, Music } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';

export function PlayerBar() {
    const [isPlaying, setIsPlaying] = useState(false);
    const [volume, setVolume] = useState(100);
    const [isMuted, setIsMuted] = useState(false);
    const [currentTime, setCurrentTime] = useState(0);
    const audioRef = useRef<HTMLAudioElement | null>(null);

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    return (
        <div className="border-t border-gray-200 bg-white/95 backdrop-blur-xl p-4">
            <div className="flex items-center justify-between max-w-7xl mx-auto">
                {/* Canción Actual */}
                <div className="flex items-center space-x-4 w-64">
                    <div className="w-14 h-14 rounded-lg bg-gradient-to-br from-pink-500 to-purple-600 flex items-center justify-center flex-shrink-0">
                        {/* El error desaparecerá porque Music ya está importado */}
                        <Music className="text-white" size={24} />
                    </div>
                    <div className="min-w-0">
                        <h4 className="font-semibold text-sm truncate">Tu Idol Generado</h4>
                        <p className="text-xs text-gray-500 truncate">Preview Track</p>
                    </div>
                </div>

                {/* Controles */}
                <div className="flex-1 max-w-2xl">
                    <div className="flex flex-col items-center space-y-2">
                        <div className="flex items-center space-x-6">
                            <button className="text-gray-600 hover:text-gray-900 transition-colors">
                                <SkipBack className="w-5 h-5" />
                            </button>
                            <button
                                className="w-10 h-10 rounded-full bg-black text-white flex items-center justify-center hover:bg-gray-800 transition-colors"
                                onClick={() => setIsPlaying(!isPlaying)}
                            >
                                {isPlaying ? (
                                    <Pause className="w-5 h-5" />
                                ) : (
                                    <Play className="w-5 h-5 ml-0.5" />
                                )}
                            </button>
                            <button className="text-gray-600 hover:text-gray-900 transition-colors">
                                <SkipForward className="w-5 h-5" />
                            </button>
                        </div>

                        {/* Progress Bar */}
                        <div className="w-full flex items-center space-x-4">
                            <span className="text-xs text-gray-500 w-10 text-right">{formatTime(currentTime)}</span>
                            <div className="flex-1 h-1 bg-gray-200 rounded-full overflow-hidden cursor-pointer hover:h-1.5 transition-all">
                                <div className="h-full bg-rose-500 rounded-full transition-all" style={{ width: '33%' }} />
                            </div>
                            <span className="text-xs text-gray-500 w-10">3:00</span>
                        </div>
                    </div>
                </div>

                {/* Volume */}
                <div className="flex items-center space-x-3 w-48">
                    <button
                        onClick={() => setIsMuted(!isMuted)}
                        className="text-gray-600 hover:text-gray-900 transition-colors"
                    >
                        {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                    </button>
                    <input
                        type="range"
                        min="0"
                        max="100"
                        value={isMuted ? 0 : volume}
                        onChange={(e) => {
                            const newVolume = Number(e.target.value);
                            setVolume(newVolume);
                            setIsMuted(newVolume === 0);
                        }}
                        className="flex-1 h-1 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-rose-500"
                    />
                </div>
            </div>
            
            {/* Audio Element (Oculto) */}
            <audio ref={audioRef} preload="metadata" />
        </div>
    );
}