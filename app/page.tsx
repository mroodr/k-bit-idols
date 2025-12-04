"use client";
import { useState, useRef, useEffect } from "react";
import { 
  Search, Music, Disc, Wallet, Play, Pause, Sparkles, Zap, 
  Home as HomeIcon, Library, Plus, Heart, SkipBack, SkipForward,
  Volume2, User, Radio, Pin, Clock, Trash2, Edit2, X
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
  | 'home' 
  | 'new' 
  | 'radio' 
  | 'pins' 
  | 'recently-added' 
  | 'artists' 
  | 'albums' 
  | 'songs' 
  | 'made-for-you'
  | 'playlist'
  | 'category';

export default function Home() {
  // --- ESTADOS DE NAVEGACIÓN ---
  const [currentView, setCurrentView] = useState<View>('home');
  const [selectedPlaylistId, setSelectedPlaylistId] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  
  // --- ESTADOS DE LA APP ---
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
  
  // Referencia al reproductor de audio oculto
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Cargar datos de localStorage al iniciar
  useEffect(() => {
    const savedAlbums = localStorage.getItem('k-bit-albums');
    const savedPlaylists = localStorage.getItem('k-bit-playlists');
    const savedPins = localStorage.getItem('k-bit-pins');
    const savedSearches = localStorage.getItem('k-bit-searches');
    
    if (savedAlbums) {
      setGeneratedAlbums(JSON.parse(savedAlbums));
    }
    if (savedPlaylists) {
      setPlaylists(JSON.parse(savedPlaylists));
    }
    if (savedPins) {
      setPinnedAlbums(JSON.parse(savedPins));
    }
    if (savedSearches) {
      setRecentSearches(JSON.parse(savedSearches));
    }
  }, []);

  // Guardar datos en localStorage cuando cambien
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
    localStorage.setItem('k-bit-searches', JSON.stringify(recentSearches));
  }, [recentSearches]);

  // Actualizar volumen cuando cambie
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume / 100;
    }
  }, [volume]);

  // --- FUNCIONES DE LA APP ---
  const handleConsultarIA = async () => {
    if (!userInput) return;
    setIsConsulting(true);
    setChatResponse("");
    
    setRecentSearches(prev => [
      { id: Date.now().toString(), query: userInput, type: "Artist" },
      ...prev.filter(s => s.query !== userInput).slice(0, 4)
    ]);
    
    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        body: JSON.stringify({ message: userInput }),
      });
      const data = await res.json();
      setChatResponse(data.result);
    } catch (e) {
      alert("Error conectando con el Producer AI");
    }
    setIsConsulting(false);
  };

  const handleGenerar = async () => {
    const prompt = userInput || chatResponse;
    if (!prompt) return;
    setIsGenerating(true);
    try {
      const res = await fetch('/api/generate', {
        method: 'POST',
        body: JSON.stringify({ prompt }),
      });
      const data = await res.json();
      const newAlbum: Album = {
        image: data.imageUrl,
        audio: data.musicUrl,
        prompt: prompt,
        id: Date.now().toString(),
        title: prompt.split(' ').slice(0, 3).join(' '),
        artist: "K-BIT IDOLS",
        createdAt: Date.now()
      };
      setGeneratedContent(newAlbum);
      setGeneratedAlbums(prev => [newAlbum, ...prev]);
      setUserInput("");
      setChatResponse("");
    } catch (e) {
      alert("Error generando los assets");
    }
    setIsGenerating(false);
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
      if (album) {
        setSelectedAlbum(album);
      } else if (!selectedAlbum && generatedContent) {
        setSelectedAlbum(generatedContent);
      }
      setIsPlaying(true);
    }
  };

  const handleNextTrack = () => {
    if (playlistQueue.length > 0 && currentQueueIndex < playlistQueue.length - 1) {
      const nextIndex = currentQueueIndex + 1;
      setCurrentQueueIndex(nextIndex);
      setSelectedAlbum(playlistQueue[nextIndex]);
      if (audioRef.current) {
        audioRef.current.src = playlistQueue[nextIndex].audio;
        audioRef.current.play().catch(console.error);
        setIsPlaying(true);
      }
    }
  };

  const handlePreviousTrack = () => {
    if (playlistQueue.length > 0 && currentQueueIndex > 0) {
      const prevIndex = currentQueueIndex - 1;
      setCurrentQueueIndex(prevIndex);
      setSelectedAlbum(playlistQueue[prevIndex]);
      if (audioRef.current) {
        audioRef.current.src = playlistQueue[prevIndex].audio;
        audioRef.current.play().catch(console.error);
        setIsPlaying(true);
      }
    }
  };

  const createPlaylist = () => {
    if (!newPlaylistName.trim()) return;
    const newPlaylist: Playlist = {
      id: Date.now().toString(),
      name: newPlaylistName,
      albums: [],
      createdAt: Date.now()
    };
    setPlaylists(prev => [...prev, newPlaylist]);
    setNewPlaylistName("");
    setShowNewPlaylistInput(false);
  };

  const deletePlaylist = (id: string) => {
    setPlaylists(prev => prev.filter(p => p.id !== id));
    if (selectedPlaylistId === id) {
      setSelectedPlaylistId(null);
      setCurrentView('home');
    }
  };

  const addToPlaylist = (playlistId: string, album: Album) => {
    setPlaylists(prev => prev.map(p => 
      p.id === playlistId 
        ? { ...p, albums: [...p.albums, album] }
        : p
    ));
  };

  const removeFromPlaylist = (playlistId: string, albumId: string) => {
    setPlaylists(prev => prev.map(p => 
      p.id === playlistId 
        ? { ...p, albums: p.albums.filter(a => a.id !== albumId) }
        : p
    ));
  };

  const togglePin = (album: Album) => {
    setPinnedAlbums(prev => {
      const isPinned = prev.some(a => a.id === album.id);
      if (isPinned) {
        return prev.filter(a => a.id !== album.id);
      } else {
        return [...prev, album];
      }
    });
  };

  const playPlaylist = (playlist: Playlist) => {
    if (playlist.albums.length === 0) return;
    setPlaylistQueue(playlist.albums);
    setCurrentQueueIndex(0);
    setSelectedAlbum(playlist.albums[0]);
    if (audioRef.current) {
      audioRef.current.src = playlist.albums[0].audio;
      audioRef.current.play().catch(console.error);
      setIsPlaying(true);
    }
  };

  // Categorías de música
  const categories = [
    { name: "Pop", color: "from-pink-500 to-rose-400", image: "🎤", description: "Los éxitos pop más recientes" },
    { name: "Hits", color: "from-yellow-400 to-orange-400", image: "🔥", description: "Los temas más populares" },
    { name: "Alternative", color: "from-green-400 to-emerald-400", image: "🎸", description: "Música alternativa" },
    { name: "Apple Music Live", color: "from-red-500 to-pink-500", image: "🎬", description: "Presentaciones en vivo" },
    { name: "Spatial Audio", color: "from-red-600 to-rose-600", image: "🔊", description: "Audio espacial" },
    { name: "Sound Therapy", color: "from-blue-400 to-cyan-400", image: "🌊", description: "Sonidos relajantes" },
    { name: "Set Lists", color: "from-red-500 to-orange-500", image: "📋", description: "Listas de conciertos" },
    { name: "Charts", color: "from-green-400 to-lime-400", image: "📊", description: "Top charts" },
    { name: "Hip-Hop", color: "from-blue-500 to-indigo-500", image: "🎧", description: "Lo mejor del hip-hop" },
    { name: "Country", color: "from-orange-400 to-amber-400", image: "🤠", description: "Música country" },
    { name: "Summertime Sounds", color: "from-blue-500 via-cyan-400 to-blue-600", image: "☀️", description: "Sonidos de verano" },
    { name: "Rock", color: "from-gray-600 to-gray-800", image: "🎸", description: "Rock clásico y moderno" },
  ];

  // Playlists iniciales
  const defaultPlaylists = [
    { id: "work", name: "Work", albums: [] },
    { id: "kids", name: "Kids stuff", albums: [] },
    { id: "olivia", name: "Olivia's Best", albums: [] },
    { id: "chill", name: "Bnn Chill", albums: [] },
  ];

  // Renderizar contenido según la vista actual
  const renderContent = () => {
    switch (currentView) {
      case 'home':
        return (
          <>
            {recentSearches.length > 0 && (
              <section className="mb-8">
                <h2 className="text-2xl font-bold mb-4">Recently Searched</h2>
                <div className="flex gap-4 flex-wrap">
                  {recentSearches.map((search) => (
                    <div
                      key={search.id}
                      className="flex items-center gap-3 p-3 bg-gray-50 hover:bg-gray-100 rounded-lg cursor-pointer transition-colors"
                      onClick={() => {
                        setUserInput(search.query);
                        handleConsultarIA();
                      }}
                    >
                      <div className="w-12 h-12 bg-gradient-to-br from-pink-400 to-purple-500 rounded-full flex items-center justify-center flex-shrink-0">
                        <Music className="text-white" size={20} />
                      </div>
                      <div>
                        <p className="font-medium text-sm">{search.query}</p>
                        <p className="text-xs text-gray-500">{search.type}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}

            <section>
              <h2 className="text-2xl font-bold mb-4">Browse Categories</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {categories.map((category, index) => (
                  <div
                    key={index}
                    className="group relative aspect-[4/3] rounded-lg overflow-hidden cursor-pointer hover:scale-[1.02] transition-transform"
                    onClick={() => {
                      setSelectedCategory(category.name);
                      setCurrentView('category');
                    }}
                  >
                    <div className={`absolute inset-0 bg-gradient-to-br ${category.color} opacity-90`} />
                    <div className="absolute inset-0 flex flex-col justify-end p-4 text-white">
                      <h3 className="text-xl font-bold mb-1">{category.name}</h3>
                      <p className="text-xs opacity-80">{category.description}</p>
                    </div>
                    <div className="absolute top-4 right-4 text-4xl opacity-80">
                      {category.image}
                    </div>
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />
                  </div>
                ))}
              </div>
            </section>

            {generatedAlbums.length > 0 && (
              <section className="mt-8">
                <h2 className="text-2xl font-bold mb-4">Made for You</h2>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                  {generatedAlbums.map((album) => (
                    <AlbumCard key={album.id} album={album} />
                  ))}
                </div>
              </section>
            )}
          </>
        );

      case 'new':
        return (
          <section>
            <h2 className="text-2xl font-bold mb-4">New Releases</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
              {generatedAlbums.slice(0, 10).map((album) => (
                <AlbumCard key={album.id} album={album} />
              ))}
            </div>
          </section>
        );

      case 'radio':
        return (
          <section>
            <h2 className="text-2xl font-bold mb-4">Radio Stations</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {categories.slice(0, 8).map((category, index) => (
                <div
                  key={index}
                  className="group relative aspect-square rounded-lg overflow-hidden cursor-pointer hover:scale-105 transition-transform"
                  onClick={() => {
                    setSelectedCategory(category.name);
                    setCurrentView('category');
                  }}
                >
                  <div className={`absolute inset-0 bg-gradient-to-br ${category.color}`} />
                  <div className="absolute inset-0 flex flex-col justify-center items-center text-white p-4">
                    <Radio size={48} className="mb-2 opacity-80" />
                    <h3 className="text-lg font-bold text-center">{category.name} Radio</h3>
                  </div>
                </div>
              ))}
            </div>
          </section>
        );

      case 'pins':
        return (
          <section>
            <h2 className="text-2xl font-bold mb-4">Pinned Albums</h2>
            {pinnedAlbums.length === 0 ? (
              <p className="text-gray-500">No tienes álbumes marcados como favoritos</p>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                {pinnedAlbums.map((album) => (
                  <AlbumCard key={album.id} album={album} />
                ))}
              </div>
            )}
          </section>
        );

      case 'recently-added':
        return (
          <section>
            <h2 className="text-2xl font-bold mb-4">Recently Added</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
              {[...generatedAlbums].sort((a, b) => b.createdAt - a.createdAt).slice(0, 20).map((album) => (
                <AlbumCard key={album.id} album={album} />
              ))}
            </div>
          </section>
        );

      case 'artists':
        return (
          <section>
            <h2 className="text-2xl font-bold mb-4">Artists</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-6">
              {Array.from(new Set(generatedAlbums.map(a => a.artist || 'Unknown'))).map((artist, index) => (
                <div key={index} className="text-center cursor-pointer group">
                  <div className="w-full aspect-square rounded-full bg-gradient-to-br from-pink-400 to-purple-500 mb-3 flex items-center justify-center text-white text-2xl font-bold group-hover:scale-105 transition-transform">
                    {artist.charAt(0)}
                  </div>
                  <p className="font-semibold text-sm">{artist}</p>
                </div>
              ))}
            </div>
          </section>
        );

      case 'albums':
        return (
          <section>
            <h2 className="text-2xl font-bold mb-4">All Albums</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
              {generatedAlbums.map((album) => (
                <AlbumCard key={album.id} album={album} />
              ))}
            </div>
          </section>
        );

      case 'songs':
        return (
          <section>
            <h2 className="text-2xl font-bold mb-4">All Songs</h2>
            <div className="space-y-2">
              {generatedAlbums.map((album, index) => (
                <div
                  key={album.id}
                  className="flex items-center gap-4 p-3 hover:bg-gray-50 rounded-lg cursor-pointer group"
                  onClick={() => toggleAudio(album)}
                >
                  <span className="text-gray-400 w-8 text-center">{index + 1}</span>
                  <img src={album.image} alt={album.title} className="w-12 h-12 rounded object-cover" />
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-sm truncate">{album.title || album.prompt}</p>
                    <p className="text-xs text-gray-500 truncate">{album.artist || "K-BIT IDOLS"}</p>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleAudio(album);
                    }}
                    className="w-8 h-8 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    {isPlaying && selectedAlbum?.id === album.id ? (
                      <Pause size={18} />
                    ) : (
                      <Play size={18} />
                    )}
                  </button>
                </div>
              ))}
            </div>
          </section>
        );

      case 'made-for-you':
        return (
          <section>
            <h2 className="text-2xl font-bold mb-4">Made for You</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
              {generatedAlbums.map((album) => (
                <AlbumCard key={album.id} album={album} />
              ))}
            </div>
          </section>
        );

      case 'playlist':
        const playlist = playlists.find(p => p.id === selectedPlaylistId);
        if (!playlist) return null;
        return (
          <section>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold">{playlist.name}</h2>
              <div className="flex items-center gap-2">
                {playlist.albums.length > 0 && (
                  <button
                    onClick={() => playPlaylist(playlist)}
                    className="px-4 py-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors flex items-center gap-2"
                  >
                    <Play size={16} />
                    Play All
                  </button>
                )}
                <button
                  onClick={() => deletePlaylist(playlist.id)}
                  className="px-4 py-2 bg-red-600 text-white rounded-full hover:bg-red-700 transition-colors flex items-center gap-2"
                >
                  <Trash2 size={16} />
                  Delete
                </button>
              </div>
            </div>
            {playlist.albums.length === 0 ? (
              <p className="text-gray-500">Esta playlist está vacía. Agrega álbumes para comenzar.</p>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                {playlist.albums.map((album) => (
                  <div key={album.id} className="relative group">
                    <AlbumCard album={album} />
                    <button
                      onClick={() => removeFromPlaylist(playlist.id, album.id)}
                      className="absolute top-2 right-2 w-8 h-8 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"
                    >
                      <X size={16} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </section>
        );

      case 'category':
        const category = categories.find(c => c.name === selectedCategory);
        return (
          <section>
            <div className="flex items-center gap-4 mb-6">
              <button
                onClick={() => setCurrentView('home')}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X size={20} />
              </button>
              <h2 className="text-2xl font-bold">{category?.name || 'Category'}</h2>
            </div>
            <p className="text-gray-600 mb-6">{category?.description}</p>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
              {generatedAlbums.slice(0, 10).map((album) => (
                <AlbumCard key={album.id} album={album} />
              ))}
            </div>
          </section>
        );

      default:
        return null;
    }
  };

  // Componente de tarjeta de álbum reutilizable
  const AlbumCard = ({ album }: { album: Album }) => {
    const isPinned = pinnedAlbums.some(a => a.id === album.id);
    
    return (
      <div className="group cursor-pointer">
        <div className="relative mb-3 aspect-square rounded-lg overflow-hidden bg-gradient-to-br from-pink-500/20 to-purple-500/20 hover:scale-105 transition-transform duration-300">
          <img
            src={album.image}
            alt={album.title || album.prompt}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/40 group-hover:bg-black/30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
            <button 
              onClick={(e) => {
                e.stopPropagation();
                toggleAudio(album);
              }}
              className="w-14 h-14 bg-blue-500 rounded-full flex items-center justify-center hover:scale-110 transition-transform shadow-lg"
            >
              {isPlaying && selectedAlbum?.id === album.id ? (
                <Pause size={24} className="text-white" />
              ) : (
                <Play size={24} className="text-white ml-1" />
              )}
            </button>
          </div>
          <button
            onClick={(e) => {
              e.stopPropagation();
              togglePin(album);
            }}
            className={`absolute top-2 right-2 w-8 h-8 rounded-full flex items-center justify-center transition-colors ${
              isPinned ? 'bg-blue-500 text-white' : 'bg-black/50 text-white opacity-0 group-hover:opacity-100'
            }`}
          >
            <Pin size={16} className={isPinned ? 'fill-white' : ''} />
          </button>
        </div>
        <h3 className="font-semibold text-sm truncate mb-1">{album.title || album.prompt}</h3>
        <p className="text-xs text-gray-500 line-clamp-2">{album.artist || "K-BIT IDOLS"}</p>
        <div className="flex items-center gap-2 mt-2">
          <select
            onChange={(e) => {
              if (e.target.value) {
                addToPlaylist(e.target.value, album);
                e.target.value = '';
              }
            }}
            onClick={(e) => e.stopPropagation()}
            className="text-xs border border-gray-300 rounded px-2 py-1 bg-white hover:bg-gray-50"
          >
            <option value="">Add to playlist...</option>
            {playlists.map(p => (
              <option key={p.id} value={p.id}>{p.name}</option>
            ))}
          </select>
        </div>
      </div>
    );
  };

  return (
    <div className="flex h-screen bg-white text-black overflow-hidden">
      
      {/* --- SIDEBAR LATERAL --- */}
      <aside className="w-64 bg-gray-50 border-r border-gray-200 flex flex-col">
        
        {/* Campo de búsqueda en el sidebar */}
        <div className="p-4 border-b border-gray-200">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && !isConsulting && handleConsultarIA()}
              placeholder="Search"
              className="w-full bg-white border border-gray-300 rounded-md pl-10 pr-4 py-2 text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors placeholder:text-gray-400"
            />
          </div>
        </div>

        {/* Navegación principal */}
        <nav className="flex-1 p-4 overflow-y-auto">
          <div className="mb-6">
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider px-4 mb-2">Browse</p>
            <button 
              onClick={() => setCurrentView('home')}
              className={`w-full flex items-center gap-3 px-4 py-2 rounded-md hover:bg-gray-100 transition-colors ${
                currentView === 'home' ? 'bg-gray-100 text-black font-semibold' : 'text-gray-600'
              }`}
            >
              <HomeIcon size={20} />
              <span>Home</span>
            </button>
            <button 
              onClick={() => setCurrentView('new')}
              className={`w-full flex items-center gap-3 px-4 py-2 rounded-md hover:bg-gray-100 transition-colors ${
                currentView === 'new' ? 'bg-gray-100 text-black font-semibold' : 'text-gray-600'
              }`}
            >
              <Sparkles size={20} />
              <span>New</span>
            </button>
            <button 
              onClick={() => setCurrentView('radio')}
              className={`w-full flex items-center gap-3 px-4 py-2 rounded-md hover:bg-gray-100 transition-colors ${
                currentView === 'radio' ? 'bg-gray-100 text-black font-semibold' : 'text-gray-600'
              }`}
            >
              <Radio size={20} />
              <span>Radio</span>
            </button>
          </div>

          <div className="mb-6">
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider px-4 mb-2">Library</p>
            <button 
              onClick={() => setCurrentView('pins')}
              className={`w-full flex items-center gap-3 px-4 py-2 rounded-md hover:bg-gray-100 transition-colors ${
                currentView === 'pins' ? 'bg-gray-100 text-black font-semibold' : 'text-gray-600'
              }`}
            >
              <Pin size={20} />
              <span>Pins</span>
            </button>
            <button 
              onClick={() => setCurrentView('recently-added')}
              className={`w-full flex items-center gap-3 px-4 py-2 rounded-md hover:bg-gray-100 transition-colors ${
                currentView === 'recently-added' ? 'bg-gray-100 text-black font-semibold' : 'text-gray-600'
              }`}
            >
              <Clock size={20} />
              <span>Recently Added</span>
            </button>
            <button 
              onClick={() => setCurrentView('artists')}
              className={`w-full flex items-center gap-3 px-4 py-2 rounded-md hover:bg-gray-100 transition-colors ${
                currentView === 'artists' ? 'bg-gray-100 text-black font-semibold' : 'text-gray-600'
              }`}
            >
              <User size={20} />
              <span>Artists</span>
            </button>
            <button 
              onClick={() => setCurrentView('albums')}
              className={`w-full flex items-center gap-3 px-4 py-2 rounded-md hover:bg-gray-100 transition-colors ${
                currentView === 'albums' ? 'bg-gray-100 text-black font-semibold' : 'text-gray-600'
              }`}
            >
              <Disc size={20} />
              <span>Albums</span>
            </button>
            <button 
              onClick={() => setCurrentView('songs')}
              className={`w-full flex items-center gap-3 px-4 py-2 rounded-md hover:bg-gray-100 transition-colors ${
                currentView === 'songs' ? 'bg-gray-100 text-black font-semibold' : 'text-gray-600'
              }`}
            >
              <Music size={20} />
              <span>Songs</span>
            </button>
            <button 
              onClick={() => setCurrentView('made-for-you')}
              className={`w-full flex items-center gap-3 px-4 py-2 rounded-md hover:bg-gray-100 transition-colors ${
                currentView === 'made-for-you' ? 'bg-gray-100 text-black font-semibold' : 'text-gray-600'
              }`}
            >
              <Heart size={20} />
              <span>Made for You</span>
            </button>
          </div>

          <div>
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider px-4 mb-2">Playlists</p>
            {showNewPlaylistInput ? (
              <div className="px-4 py-2">
                <input
                  type="text"
                  value={newPlaylistName}
                  onChange={(e) => setNewPlaylistName(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      createPlaylist();
                    } else if (e.key === 'Escape') {
                      setShowNewPlaylistInput(false);
                      setNewPlaylistName("");
                    }
                  }}
                  placeholder="Playlist name"
                  className="w-full border border-gray-300 rounded px-2 py-1 text-sm focus:outline-none focus:border-blue-500"
                  autoFocus
                />
                <div className="flex gap-2 mt-2">
                  <button
                    onClick={createPlaylist}
                    className="px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700"
                  >
                    Create
                  </button>
                  <button
                    onClick={() => {
                      setShowNewPlaylistInput(false);
                      setNewPlaylistName("");
                    }}
                    className="px-3 py-1 bg-gray-300 rounded text-sm hover:bg-gray-400"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <button 
                onClick={() => setShowNewPlaylistInput(true)}
                className="w-full flex items-center gap-3 px-4 py-2 rounded-md hover:bg-gray-100 text-gray-600 transition-colors"
              >
                <Plus size={20} />
                <span>New Playlist</span>
              </button>
            )}
            {[...defaultPlaylists, ...playlists].map((playlist) => (
              <button
                key={playlist.id}
                onClick={() => {
                  setSelectedPlaylistId(playlist.id);
                  setCurrentView('playlist');
                }}
                className={`w-full flex items-center justify-between gap-3 px-4 py-2 rounded-md hover:bg-gray-100 transition-colors text-sm ${
                  currentView === 'playlist' && selectedPlaylistId === playlist.id 
                    ? 'bg-gray-100 text-black font-semibold' 
                    : 'text-gray-600'
                }`}
              >
                <span className="truncate">{playlist.name}</span>
                {playlist.albums.length > 0 && (
                  <span className="text-xs text-gray-400">{playlist.albums.length}</span>
                )}
              </button>
            ))}
          </div>
        </nav>
      </aside>

      {/* --- CONTENIDO PRINCIPAL --- */}
      <main className="flex-1 flex flex-col overflow-hidden bg-white">
        
        {/* Barra superior */}
        <header className="h-16 border-b border-gray-200 flex items-center justify-between px-6 bg-white">
          
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                <Music className="text-white" size={18} />
              </div>
              <span className="text-xl font-semibold">Music</span>
              {currentView !== 'home' && (
                <span className="text-xl font-bold ml-4">{categories.find(c => c.name === selectedCategory)?.name || currentView.charAt(0).toUpperCase() + currentView.slice(1).replace('-', ' ')}</span>
              )}
            </div>
            
            <div className="flex items-center gap-2">
              <button 
                onClick={handlePreviousTrack}
                disabled={playlistQueue.length === 0 || currentQueueIndex === 0}
                className="w-8 h-8 flex items-center justify-center hover:bg-gray-100 rounded-full transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <SkipBack size={18} className="text-gray-700" />
              </button>
              <button 
                onClick={() => toggleAudio()}
                className="w-10 h-10 flex items-center justify-center bg-black text-white rounded-full hover:bg-gray-800 transition-colors"
              >
                {isPlaying ? <Pause size={20} /> : <Play size={20} className="ml-0.5" />}
              </button>
              <button 
                onClick={handleNextTrack}
                disabled={playlistQueue.length === 0 || currentQueueIndex >= playlistQueue.length - 1}
                className="w-8 h-8 flex items-center justify-center hover:bg-gray-100 rounded-full transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <SkipForward size={18} className="text-gray-700" />
              </button>
            </div>
          </div>

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
                onKeyPress={(e) => e.key === 'Enter' && !isConsulting && handleConsultarIA()}
                placeholder="Busca sólo en tu biblioteca o en todo el catálogo de Apple Music."
                className="w-full bg-gray-100 border border-gray-300 rounded-full pl-32 pr-4 py-2.5 text-sm focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all placeholder:text-gray-400"
                disabled={isConsulting || isGenerating}
              />
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Volume2 size={20} className="text-gray-600" />
              <input
                type="range"
                min="0"
                max="100"
                value={volume}
                onChange={(e) => setVolume(Number(e.target.value))}
                className="w-24 h-1 bg-gray-200 rounded-lg appearance-none cursor-pointer"
              />
            </div>
            <button className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center hover:bg-gray-400 transition-colors">
              <User size={18} className="text-gray-600" />
            </button>
          </div>
        </header>

        {/* Área de contenido scrollable */}
        <div className="flex-1 overflow-y-auto">
          <div className="p-6">
            
            {/* Respuesta del asistente */}
            {chatResponse && currentView === 'home' && (
              <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <Sparkles size={18} className="text-blue-600" />
                  <h3 className="text-blue-600 font-semibold">Sugerencia del Producer AI</h3>
                </div>
                <p className="text-gray-700 text-sm whitespace-pre-line leading-relaxed">{chatResponse}</p>
                <button
                  onClick={handleGenerar}
                  disabled={isGenerating}
                  className="mt-4 flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-full text-sm font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Zap size={16} />
                  {isGenerating ? "Generando..." : "Generar Álbum"}
                </button>
              </div>
            )}

            {/* Renderizar contenido según la vista */}
            {renderContent()}

            {/* Estado inicial */}
            {currentView === 'home' && !chatResponse && generatedAlbums.length === 0 && recentSearches.length === 0 && (
              <div className="flex items-center justify-center py-20">
                <div className="text-center max-w-md">
                  <Music size={64} className="mx-auto mb-4 text-gray-300" />
                  <h2 className="text-2xl font-bold mb-2">Bienvenido a K-BIT IDOLS</h2>
                  <p className="text-gray-500 mb-6">
                    Describe tu grupo de ídolos soñado y genera música e imágenes únicas con inteligencia artificial.
                  </p>
                  <div className="flex items-center justify-center gap-2 text-sm text-gray-400">
                    <Search size={16} />
                    <span>Usa la barra de búsqueda para comenzar</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Reproductor de audio oculto */}
      <audio
        ref={audioRef}
        onEnded={() => {
          setIsPlaying(false);
          // Auto-play siguiente track en queue
          if (playlistQueue.length > 0 && currentQueueIndex < playlistQueue.length - 1) {
            handleNextTrack();
          }
        }}
        onPlay={() => {
          setIsPlaying(true);
          if (audioRef.current) {
            audioRef.current.volume = volume / 100;
          }
        }}
        onPause={() => setIsPlaying(false)}
      />
    </div>
  );
}
