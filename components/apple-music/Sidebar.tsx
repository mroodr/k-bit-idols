'use client';

import React, { useState } from 'react';
import {
    Home as HomeIcon,
    Search,
    PlusCircle,
    Library,
    Heart,
    Disc as Album,
    Sparkles,
    Music,
    Pin,
    Clock,
    User,
    Radio,
    Star,
} from 'lucide-react';

function ConnectWallet() {
    const [connected, setConnected] = useState(false);

    return (
        <div className="flex items-center">
            <button
                onClick={() => setConnected((s) => !s)}
                className="px-4 py-2 bg-gradient-to-r from-rose-500 to-pink-600 text-white rounded-lg text-sm font-semibold hover:from-rose-600 hover:to-pink-700 transition-all"
                aria-pressed={connected}
            >
                {connected ? 'Wallet Connected' : 'Connect Wallet'}
            </button>
        </div>
    );
}

export function Sidebar() {
    const [activeItem, setActiveItem] = useState('inicio');
    const [searchQuery, setSearchQuery] = useState('');

    const menuItems = [
        { id: 'inicio', label: 'Inicio', icon: HomeIcon },
        { id: 'buscar', label: 'Buscar', icon: Search },
        { id: 'radio', label: 'Radio', icon: Radio },
    ];

    const libraryItems = [
        { id: 'pins', label: 'Pins', icon: Pin },
        { id: 'recently-added', label: 'Recently Added', icon: Clock },
        { id: 'artists', label: 'Artists', icon: User },
        { id: 'albums', label: 'Albums', icon: Album },
        { id: 'songs', label: 'Songs', icon: Music },
        { id: 'made-for-you', label: 'Made for You', icon: Heart },
    ];

    const playlists = [
        { name: 'Work' },
        { name: "Kids stuff" },
        { name: "Olivia's Best" },
        { name: 'Bnn Chill' },
    ];

    return (
        <div className="w-64 bg-gray-50 border-r border-gray-200 flex flex-col h-screen overflow-y-auto">
            {/* Campo de búsqueda en el sidebar */}
            <div className="p-4 border-b border-gray-200">
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                    <input
                        type="text"
                        placeholder="Search"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full bg-white border border-gray-300 rounded-md pl-10 pr-4 py-2 text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors placeholder:text-gray-400"
                    />
                </div>
            </div>

            {/* BROWSE Section */}
            <div className="p-4">
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider px-4 mb-2">Browse</p>
                <nav className="space-y-1">
                    {menuItems.map((item) => {
                        const Icon = item.icon;
                        const isActive = activeItem === item.id;
                        return (
                            <button
                                key={item.id}
                                onClick={() => setActiveItem(item.id)}
                                className={`w-full flex items-center gap-3 px-4 py-2 rounded-md transition-colors text-left ${
                                    isActive
                                        ? 'bg-gray-100 text-black font-semibold'
                                        : 'text-gray-600 hover:bg-gray-100'
                                }`}
                            >
                                <Icon size={20} />
                                <span>{item.label}</span>
                            </button>
                        );
                    })}
                </nav>
            </div>

            {/* LIBRARY Section */}
            <div className="p-4 border-t border-gray-200">
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider px-4 mb-2">Library</p>
                <nav className="space-y-1">
                    {libraryItems.map((item) => {
                        const Icon = item.icon;
                        const isActive = activeItem === item.id;
                        return (
                            <button
                                key={item.id}
                                onClick={() => setActiveItem(item.id)}
                                className={`w-full flex items-center gap-3 px-4 py-2 rounded-md transition-colors text-left ${
                                    isActive
                                        ? 'bg-gray-100 text-black font-semibold'
                                        : 'text-gray-600 hover:bg-gray-100'
                                }`}
                            >
                                <Icon size={20} />
                                <span>{item.label}</span>
                            </button>
                        );
                    })}
                </nav>
            </div>

            {/* PLAYLISTS Section */}
            <div className="p-4 border-t border-gray-200 flex-1">
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider px-4 mb-2">Playlists</p>
                <nav className="space-y-1">
                    <button className="w-full flex items-center gap-3 px-4 py-2 rounded-md hover:bg-gray-100 text-gray-600 transition-colors text-left">
                        <PlusCircle size={20} />
                        <span>New Playlist</span>
                    </button>
                    {playlists.map((playlist) => (
                        <button
                            key={playlist.name}
                            onClick={() => setActiveItem(`playlist-${playlist.name}`)}
                            className={`w-full flex items-center gap-3 px-4 py-2 rounded-md transition-colors text-left text-sm ${
                                activeItem === `playlist-${playlist.name}`
                                    ? 'bg-gray-100 text-black font-semibold'
                                    : 'text-gray-600 hover:bg-gray-100'
                            }`}
                        >
                            <span>{playlist.name}</span>
                        </button>
                    ))}
                </nav>
            </div>

            {/* Footer con Wallet */}
            <div className="mt-auto p-4 border-t border-gray-200">
                <ConnectWallet />
            </div>
        </div>
    );
}
