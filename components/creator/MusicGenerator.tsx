// app/components/creator/MusicGenerator.tsx
"use client"; // Importante para que funcione la interactividad

import { useState } from 'react';

export default function MusicGenerator() {
  const [prompt, setPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);

  const generateSong = async () => {
    if (!prompt) return;
    setLoading(true);
    setAudioUrl(null); // Limpiar audio anterior

    try {
      // Llamamos a NUESTRA api interna, no a Hugging Face directamente
      const response = await fetch('/api/music', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt }),
      });

      if (!response.ok) throw new Error('Error al generar');

      // Convertimos la respuesta (blob) en una URL reproducible
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      setAudioUrl(url);
      
    } catch (error) {
      console.error(error);
      alert("Hubo un error creando la canción. Intenta de nuevo.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-4 p-6 bg-gray-900 text-white rounded-xl border border-gray-700 max-w-md mx-auto mt-10">
      <h2 className="text-xl font-bold text-center text-purple-400">👾 K-Bit Studio</h2>
      
      <div className="flex flex-col gap-2">
        <label className="text-sm text-gray-400">Describe tu canción:</label>
        <input
          type="text"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Ej: Batalla contra jefe final..."
          className="p-3 rounded bg-gray-800 border border-gray-600 focus:border-purple-500 outline-none text-white"
        />
      </div>

      <button
        onClick={generateSong}
        disabled={loading || !prompt}
        className={`p-3 rounded font-bold transition-all ${
          loading 
            ? "bg-gray-600 cursor-not-allowed" 
            : "bg-purple-600 hover:bg-purple-700 active:scale-95"
        }`}
      >
        {loading ? "Componiendo Bits... 🎵" : "Generar Canción 🚀"}
      </button>

      {audioUrl && (
        <div className="mt-4 animate-fade-in bg-gray-800 p-4 rounded-lg">
          <p className="text-xs text-center mb-2 text-green-400">✨ ¡Generación Exitosa!</p>
          <audio controls src={audioUrl} className="w-full" />
        </div>
      )}
    </div>
  );
}