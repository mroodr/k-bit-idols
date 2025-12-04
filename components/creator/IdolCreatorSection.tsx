// app/components/creator/IdolCreatorSection.tsx
'use client';

import { useState } from 'react';
import { Music, Image, Zap, Sparkles, Palette, Timer, Users } from 'lucide-react';

export function IdolCreatorSection() {
    const [prompt, setPrompt] = useState('');
    const [bpm, setBpm] = useState(128);
    const [style, setStyle] = useState('cyberpunk');
    const [groupSize, setGroupSize] = useState(4);
    const [isGenerating, setIsGenerating] = useState(false);

    const styles = [
        { id: 'cyberpunk', label: 'Cyberpunk', color: 'from-blue-500 to-purple-600', icon: '🤖' },
        { id: 'cute', label: 'Cute Concept', color: 'from-pink-500 to-rose-600', icon: '🌸' },
        { id: 'girlcrush', label: 'Girl Crush', color: 'from-red-500 to-orange-600', icon: '👑' },
        { id: 'retro', label: 'Retro Gaming', color: 'from-green-500 to-teal-600', icon: '🎮' },
        { id: 'fantasy', label: 'Fantasy', color: 'from-purple-500 to-indigo-600', icon: '🧚' },
    ];

    const groupSizes = [1, 2, 3, 4, 5, 6];

    const handleCreate = async () => {
        if (!prompt.trim()) return;

        setIsGenerating(true);
        // Simulación de generación
        setTimeout(() => {
            setIsGenerating(false);
            // Aquí iría la lógica real de generación
            alert('¡Demo generada! Revisa la vista previa.');
        }, 3000);
    };

    return (
        <div className="apple-card p-8">
            <div className="flex items-center justify-between mb-8">
                <div>
                    <div className="flex items-center space-x-3 mb-2">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-pink-500 to-purple-600 
                         flex items-center justify-center">
                            <Sparkles className="w-5 h-5 text-white" />
                        </div>
                        <div>
                            <h2 className="text-3xl font-bold gradient-text">Crear Nuevo Idol</h2>
                            <p className="text-gray-400">Describe tu visión y la IA hará el resto</p>
                        </div>
                    </div>
                </div>

                <div className="flex items-center space-x-2 text-sm bg-gray-900/50 px-4 py-2 rounded-full">
                    <Zap className="w-4 h-4 text-yellow-400" />
                    <span>Base Sepolia Testnet</span>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Panel izquierdo: Configuración */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Prompt principal */}
                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <label className="text-lg font-semibold text-white">
                                Describe tu Idol K-Pop
                            </label>
                            <span className="text-sm text-gray-400">{prompt.length}/500</span>
                        </div>
                        <textarea
                            className="w-full h-40 bg-gray-900/70 border-2 border-gray-700 rounded-2xl p-5 
                       focus:outline-none focus:border-pink-500 focus:ring-2 focus:ring-pink-500/20
                       placeholder-gray-600 resize-none text-white text-lg"
                            placeholder="Ej: 'Un grupo de 4 chicas estilo cyberpunk futurista con coreografías sincronizadas, vistiendo trajes neón con elementos de tecnología avanzada. La música debe ser electropop con drops energéticos y voces angelicales...'"
                            value={prompt}
                            onChange={(e) => setPrompt(e.target.value)}
                            maxLength={500}
                        />
                        <div className="flex items-center space-x-2 text-sm text-gray-500">
                            <Sparkles className="w-4 h-4" />
                            <span>Mientras más detallado, mejor será el resultado</span>
                        </div>
                    </div>

                    {/* Configuraciones rápidas */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {/* BPM */}
                        <div className="space-y-3">
                            <div className="flex items-center space-x-2">
                                <Music className="w-5 h-5 text-pink-400" />
                                <label className="font-medium">BPM (Tempo)</label>
                            </div>
                            <div className="space-y-2">
                                <div className="flex justify-between">
                                    <span className="text-2xl font-bold gradient-text">{bpm}</span>
                                    <span className="text-sm text-gray-400">BPM</span>
                                </div>
                                <input
                                    type="range"
                                    min="80"
                                    max="160"
                                    value={bpm}
                                    onChange={(e) => setBpm(parseInt(e.target.value))}
                                    className="w-full h-2 bg-gray-800 rounded-lg appearance-none cursor-pointer 
                           [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-5 
                           [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:rounded-full 
                           [&::-webkit-slider-thumb]:bg-gradient-to-r [&::-webkit-slider-thumb]:from-pink-500 
                           [&::-webkit-slider-thumb]:to-purple-600 [&::-webkit-slider-thumb]:shadow-lg"
                                />
                                <div className="flex justify-between text-xs text-gray-500">
                                    <span>Lento</span>
                                    <span>Medio</span>
                                    <span>Rápido</span>
                                </div>
                            </div>
                        </div>

                        {/* Tamaño del grupo */}
                        <div className="space-y-3">
                            <div className="flex items-center space-x-2">
                                <Users className="w-5 h-5 text-purple-400" />
                                <label className="font-medium">Miembros</label>
                            </div>
                            <div className="flex flex-wrap gap-2">
                                {groupSizes.map((size) => (
                                    <button
                                        key={size}
                                        onClick={() => setGroupSize(size)}
                                        className={`px-4 py-2 rounded-lg font-medium transition-all ${groupSize === size
                                                ? 'bg-gradient-to-r from-pink-500 to-purple-600 text-white'
                                                : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
                                            }`}
                                    >
                                        {size} {size === 1 ? 'Solo' : 'Miembros'}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Duración */}
                        <div className="space-y-3">
                            <div className="flex items-center space-x-2">
                                <Timer className="w-5 h-5 text-blue-400" />
                                <label className="font-medium">Duración</label>
                            </div>
                            <div className="bg-gray-900/50 rounded-xl p-4">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <div className="text-lg font-bold">15 segundos</div>
                                        <div className="text-sm text-gray-400">Demo gratuita</div>
                                    </div>
                                    <div className="text-right">
                                        <div className="text-lg font-bold text-green-400">FREE</div>
                                        <div className="text-sm text-gray-400">Sin costo</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Estilos */}
                    <div className="space-y-4">
                        <div className="flex items-center space-x-2">
                            <Palette className="w-5 h-5 text-cyan-400" />
                            <label className="font-medium">Estilo Visual</label>
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                            {styles.map((s) => (
                                <button
                                    key={s.id}
                                    onClick={() => setStyle(s.id)}
                                    className={`relative p-4 rounded-xl border-2 transition-all ${style === s.id
                                            ? `border-transparent bg-gradient-to-br ${s.color} text-white shadow-lg`
                                            : 'border-gray-800 bg-gray-900/50 text-gray-400 hover:border-gray-700'
                                        }`}
                                >
                                    <div className="text-2xl mb-2">{s.icon}</div>
                                    <div className="font-medium">{s.label}</div>
                                    {style === s.id && (
                                        <div className="absolute -top-2 -right-2 w-6 h-6 bg-white rounded-full 
                                 flex items-center justify-center">
                                            <div className="w-3 h-3 rounded-full bg-gradient-to-r from-pink-500 to-purple-600" />
                                        </div>
                                    )}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Panel derecho: Preview y Acción */}
                <div className="space-y-6">
                    {/* Preview Card */}
                    <div className="kbit-card p-6">
                        <div className="flex items-center space-x-3 mb-6">
                            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-gray-800 to-black 
                           flex items-center justify-center border border-gray-700">
                                <Image className="w-5 h-5 text-gray-400" />
                            </div>
                            <div>
                                <h3 className="font-bold text-white">Vista Previa</h3>
                                <p className="text-sm text-gray-400">Así se verá tu creación</p>
                            </div>
                        </div>

                        {/* Preview Image */}
                        <div className="aspect-square rounded-xl bg-gradient-to-br from-gray-900 to-black 
                          border-2 border-gray-800 flex flex-col items-center justify-center mb-6">
                            <div className="text-center p-6">
                                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-pink-500/20 to-purple-500/20 
                             flex items-center justify-center mx-auto mb-4">
                                    <Sparkles className="w-10 h-10 text-gray-600" />
                                </div>
                                <p className="text-gray-500 mb-2">Imagen generada aparecerá aquí</p>
                                <p className="text-xs text-gray-600">Estilo: {styles.find(s => s.id === style)?.label}</p>
                            </div>
                        </div>

                        {/* Info del mint */}
                        <div className="space-y-4">
                            <div className="flex justify-between items-center p-3 bg-gray-900/50 rounded-lg">
                                <div className="text-sm text-gray-400">Costo de mint:</div>
                                <div className="text-lg font-bold text-green-400">0.001 ETH</div>
                            </div>
                            <div className="flex justify-between items-center p-3 bg-gray-900/50 rounded-lg">
                                <div className="text-sm text-gray-400">Red:</div>
                                <div className="flex items-center space-x-2">
                                    <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                                    <span className="text-sm">Base Sepolia</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Botón de acción principal */}
                    <button
                        onClick={handleCreate}
                        disabled={isGenerating || !prompt.trim()}
                        className={`w-full py-5 rounded-2xl font-bold text-lg transition-all relative overflow-hidden
                     ${isGenerating || !prompt.trim()
                                ? 'bg-gray-800 text-gray-400 cursor-not-allowed'
                                : 'bg-gradient-to-r from-pink-600 via-purple-600 to-blue-600 text-white hover:shadow-2xl hover:shadow-pink-500/25 group'
                            }`}
                    >
                        {/* Efecto de brillo */}
                        {!isGenerating && prompt.trim() && (
                            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent 
                           translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
                        )}

                        <div className="relative flex items-center justify-center space-x-3">
                            {isGenerating ? (
                                <>
                                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                    <span>Generando con IA...</span>
                                </>
                            ) : (
                                <>
                                    <Sparkles className="w-5 h-5" />
                                    <span>🎵 Generar Demo Gratis (15s)</span>
                                </>
                            )}
                        </div>
                    </button>

                    {/* Info adicional */}
                    <div className="text-center space-y-2">
                        <p className="text-xs text-gray-500">
                            La demo de 15s es completamente gratis. Solo pagas 0.001 ETH al mintear la versión completa.
                        </p>
                        <div className="flex items-center justify-center space-x-4 text-xs text-gray-600">
                            <span className="flex items-center space-x-1">
                                <div className="w-2 h-2 rounded-full bg-green-500" />
                                <span>Sin tarifas ocultas</span>
                            </span>
                            <span>•</span>
                            <span>Propiedad 100% tuya</span>
                            <span>•</span>
                            <span>Royalties 5%</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}