"use client";
import { useState, useRef, useEffect } from "react";

// --- CAMBIO CLAVE: Usamos componentes de OnchainKit en lugar de RainbowKit ---
import { 
  Wallet, 
  ConnectWallet, 
  WalletDropdown, 
  WalletDropdownDisconnect 
} from '@coinbase/onchainkit/wallet';
import { 
  Address, 
  Avatar, 
  Name, 
  Identity, 
  EthBalance 
} from '@coinbase/onchainkit/identity';

import { 
  Search, Music, Disc, Play, Pause, Sparkles, Zap, 
  Home as HomeIcon, Pin, Clock, Trash2, Plus, Heart, 
  SkipBack, SkipForward, Volume2, Radio, X
} from "lucide-react";

// Tipos de datos
type Album = {
  image: string;
  audio: string;
  prompt: string;
  id: string;
  title?: string;
  artist?: string;
  createdAt: number;
};

type Playlist = {
  id: string;
  name: string;
  albums: Album[];
  createdAt: number;
};

type View = 
  | 'home' | 'new' | 'radio' | 'pins' | 'recently-added' 
  | 'artists' | 'albums' | 'songs' | 'made-for-you'
  | 'playlist' | 'category';

export default function Home() {
  // --- ESTADOS ---
  const [currentView, setCurrentView] = useState<View>('home');
  const [selectedPlaylistId, setSelectedPlaylistId] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [userInput, setUserInput] = useState("");
  const [chatResponse, setChatResponse] = useState("");
  const [isConsulting, setIsConsulting] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedContent, setGeneratedContent] = useState<Album | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [generatedAlbums, setGeneratedAlbums] = useState<Album[]>([]);
  const [selectedAlbum, setSelectedAlbum] = useState<Album | null>(null);
  const [recentSearches, setRecentSearches] = useState<Array<{id: string, query: string, type: string}>>([]);
  const [volume, setVolume] = useState(50);
  const [playlists, setPlaylists] = useState<Playlist[]>([]);
  const [newPlaylistName, setNewPlaylistName] = useState("");
  const [showNewPlaylistInput, setShowNewPlaylistInput] = useState(false);
  const [pinnedAlbums, setPinnedAlbums] = useState<Album[]>([]);
  const [playlistQueue, setPlaylistQueue] = useState<Album[]>([]);
  const [currentQueueIndex, setCurrentQueueIndex] = useState(0);
  
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Cargar datos
  useEffect(() => {
    const savedAlbums = localStorage.getItem('k-bit-albums');
    const savedPlaylists = localStorage.getItem('k-bit-playlists');
    const savedPins = localStorage.getItem('k-bit-pins');
    
    if (savedAlbums) setGeneratedAlbums(JSON.parse(savedAlbums));
    if (savedPlaylists) setPlaylists(JSON.parse(savedPlaylists));
    if (savedPins) setPinnedAlbums(JSON.parse(savedPins));
  }, []);

  // Guardar datos
  useEffect(() => {
    localStorage.setItem('k-bit-albums', JSON.stringify(generatedAlbums));
  }, [generatedAlbums]);

  useEffect(() => {
    localStorage.setItem('k-bit-playlists', JSON.stringify(playlists));
  }, [playlists]);

  useEffect(() => {
    localStorage.setItem('k-bit-pins', JSON.stringify(pinnedAlbums));
  }, [pinnedAlbums]);

  useEffect(() => {
    if (audioRef.current) audioRef.current.volume = volume / 100;
  }, [volume]);

  // --- LÓGICA DE IA Y MÚSICA ---
  const handleConsultarIA = async () => {
    if (!userInput) return;
    setIsConsulting(true);
    // Simulación de chat (puedes conectar tu API real aquí)
    setTimeout(() => {
      setChatResponse(`¡Gran idea! Una canción estilo 8-bit inspirada en "${userInput}" sonaría épica.`);
      setIsConsulting(false);
    }, 1000);
  };

  const handleGenerar = async () => {
    const prompt = userInput || chatResponse;
    if (!prompt) return;
    setIsGenerating(true);
    
    try {
      const res = await fetch('/api/music', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt }),
      });

      if (!res.ok) throw new Error("Error en la generación");

      const blob = await res.blob();
      const musicUrl = URL.createObjectURL(blob);
      
      // Generador de portadas "Pixel Art" simple
      const randomColor = Math.floor(Math.random()*16777215).toString(16);
      const imageUrl = `https://placehold.co/400x400/${randomColor}/FFF?text=K-BIT+${prompt.substring(0,5)}`;

      const newAlbum: Album = {
        image: imageUrl,
        audio: musicUrl,
        prompt: prompt,
        id: Date.now().toString(),
        title: prompt.split(' ').slice(0, 4).join(' '),
        artist: "K-BIT AI",
        createdAt: Date.now()
      };

      setGeneratedContent(newAlbum);
      setGeneratedAlbums(prev => [newAlbum, ...prev]);
      setUserInput("");
      setChatResponse(""); 

    } catch (e) {
      console.error(e);
      alert("Error generando música. Verifica tu token de Hugging Face.");
    } finally {
      setIsGenerating(false);
    }
  };

  const toggleAudio = (album?: Album) => {
    const targetAlbum = album || selectedAlbum || generatedContent;
    if (!targetAlbum || !audioRef.current) return;

    const isSameAlbum = selectedAlbum?.id === targetAlbum.id || 
                        (!selectedAlbum && generatedContent?.id === targetAlbum.id);
    
    if (isPlaying && isSameAlbum) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.src = targetAlbum.audio;
      audioRef.current.play().catch(console.error);
      if (album) setSelectedAlbum(album);
      setIsPlaying(true);
    }
  };

  const categories = [
    { name: "Chiptune", color: "from-purple-500 to-indigo-500", image: "👾", description: "Estilo 8-bit clásico" },
    { name: "Gaming", color: "from-red-600 to-rose-600", image: "🎮", description: "Soundtracks de juegos" },
    { name: "Retro", color: "from-yellow-400 to-orange-400", image: "🕹️", description: "Arcade Vibes" },
  ];

  // Renderizado parcial para mantener el código limpio
  return (
    <div className="flex h-screen bg-white text-black overflow-hidden">
      
      {/* SIDEBAR */}
      <aside className="w-64 bg-gray-50 border-r border-gray-200 flex flex-col">
        <div className="p-4 border-b border-gray-200">
           <div className="flex items-center gap-2 font-bold text-xl">
             <div className="w-8 h-8 bg-blue-600 rounded flex items-center justify-center text-white">K</div>
             Bit-Idols
           </div>
        </div>
        <nav className="flex-1 p-4 space-y-2">
            <button onClick={() => setCurrentView('home')} className={`w-full flex items-center gap-3 px-4 py-2 rounded-md hover:bg-gray-200 ${currentView === 'home' ? 'bg-gray-200 font-bold' : ''}`}>
              <HomeIcon size={20} /> Home
            </button>
            <button onClick={() => setCurrentView('albums')} className="w-full flex items-center gap-3 px-4 py-2 rounded-md hover:bg-gray-200">
              <Disc size={20} /> Library
            </button>
        </nav>
      </aside>

      {/* MAIN CONTENT */}
      <main className="flex-1 flex flex-col overflow-hidden bg-white">
        
        {/* HEADER */}
        <header className="h-16 border-b border-gray-200 flex items-center justify-between px-6 bg-white">
          <div className="flex-1 max-w-xl mx-auto">
             <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input
                  type="text"
                  value={userInput}
                  onChange={(e) => setUserInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleGenerar()}
                  placeholder="Describe tu canción (Ej: Boss battle theme)..."
                  className="w-full bg-gray-100 border border-gray-300 rounded-full pl-10 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
             </div>
          </div>

          <div className="flex items-center gap-4 ml-4">
            {/* BOTÓN DE ONCHAINKIT (Coinbase Wallet) */}
            <Wallet>
              <ConnectWallet className="bg-black text-white px-4 py-2 rounded-full hover:bg-gray-800 transition-colors font-medium text-sm flex items-center gap-2">
                <Avatar className="h-6 w-6" />
                <Name />
              </ConnectWallet>
              <WalletDropdown>
                <Identity className="px-4 pt-3 pb-2" hasCopyAddressOnClick>
                  <Avatar />
                  <Name />
                  <Address />
                  <EthBalance />
                </Identity>
                <WalletDropdownDisconnect />
              </WalletDropdown>
            </Wallet>
          </div>
        </header>

        {/* CONTENIDO DINÁMICO */}
        <div className="flex-1 overflow-y-auto p-6">
            
            {/* Mensaje de carga */}
            {isGenerating && (
              <div className="flex flex-col items-center justify-center p-12 bg-purple-50 rounded-xl mb-6 animate-pulse">
                 <Sparkles size={48} className="text-purple-600 mb-4" />
                 <h3 className="text-xl font-bold text-purple-700">Componiendo en 8-bits...</h3>
                 <p className="text-purple-500">La IA está procesando tu solicitud.</p>
              </div>
            )}

            {/* Grid de Álbumes */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                {generatedAlbums.map(album => (
                    <div key={album.id} onClick={() => toggleAudio(album)} className="group cursor-pointer">
                        <div className="relative aspect-square bg-gray-200 rounded-lg overflow-hidden mb-3 shadow-sm hover:shadow-md transition-shadow">
                            <img src={album.image} alt="cover" className="w-full h-full object-cover" />
                            {/* Overlay Play Button */}
                            <div className={`absolute inset-0 bg-black/40 flex items-center justify-center transition-opacity ${isPlaying && selectedAlbum?.id === album.id ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}>
                                <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center">
                                   {isPlaying && selectedAlbum?.id === album.id ? (
                                     <Pause size={24} className="text-black" />
                                   ) : (
                                     <Play size={24} className="text-black ml-1" />
                                   )}
                                </div>
                            </div>
                        </div>
                        <h3 className="font-bold text-sm truncate">{album.title}</h3>
                        <p className="text-xs text-gray-500">{album.artist}</p>
                    </div>
                ))}
            </div>

            {/* Estado vacío */}
            {!isGenerating && generatedAlbums.length === 0 && (
                <div className="flex flex-col items-center justify-center h-full text-gray-400 mt-10">
                    <Music size={64} className="mb-4 opacity-20" />
                    <p>No hay canciones todavía.</p>
                    <p className="text-sm">Escribe un prompt arriba y presiona Enter.</p>
                </div>
            )}
        </div>
      </main>

      {/* REPRODUCTOR DE AUDIO */}
      <audio ref={audioRef} onEnded={() => setIsPlaying(false)} />
    </div>
  );
}