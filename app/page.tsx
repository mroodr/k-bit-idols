"use client";

import { 
  ConnectWallet, 
  Wallet, 
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

import { useState, useRef } from "react";
import { Sparkles, Play, Pause, Zap, Music, Disc, Loader2 } from "lucide-react";
import { useSendTransaction, useWaitForTransactionReceipt, useAccount, useReadContract } from 'wagmi';
import { parseEther, formatUnits } from 'viem';
import { baseSepolia } from 'wagmi/chains';
import { CircleLoader } from './components/CircleLoader';
import { useCirclePayment } from './hooks/useCirclePayment';
import { USDC_CONTRACT_BASE_SEPOLIA, USDC_ABI, MINT_PRICE_USDC } from './lib/usdc';

// Dirección del contrato/treasury para recibir pagos (Base Sepolia)
// NOTA: Cambia esto por tu dirección de wallet o contrato real
const MINT_RECIPIENT = process.env.NEXT_PUBLIC_MINT_RECIPIENT || '0x0000000000000000000000000000000000000000';
const MINT_AMOUNT = '0.0001'; // ETH

// Deshabilitar SSR para esta página porque usa hooks de Wagmi que requieren el cliente
export const dynamic = 'force-dynamic';

export default function Home() {
  // --- ESTADOS (Memoria de la App) ---
  const [userInput, setUserInput] = useState("");
  const [chatResponse, setChatResponse] = useState("");
  const [isConsulting, setIsConsulting] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedContent, setGeneratedContent] = useState<{image: string, audio: string} | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  
  // Referencia al reproductor de audio oculto
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // --- Web3 Hooks (Wagmi) ---
  const { address, isConnected } = useAccount();
  
  // Hook para transacciones ETH
  const {
    data: hash,
    isPending: isPendingTransaction,
    sendTransaction,
    error: sendError,
  } = useSendTransaction();

  const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({
    hash,
  });

  // --- Circle USDC Payment Hook ---
  const {
    sendUSDC,
    hash: usdcHash,
    isPending: isPendingUSDC,
    isConfirming: isConfirmingUSDC,
    isConfirmed: isConfirmedUSDC,
    error: usdcError,
  } = useCirclePayment();

  // Verificar balance USDC del usuario
  const { data: usdcBalance } = useReadContract({
    address: USDC_CONTRACT_BASE_SEPOLIA,
    abi: USDC_ABI,
    functionName: 'balanceOf',
    args: address ? [address] : undefined,
    chainId: baseSepolia.id,
    query: {
      enabled: !!address && isConnected,
    },
  });

  const usdcBalanceFormatted = usdcBalance 
    ? parseFloat(formatUnits(usdcBalance, 6)).toFixed(2)
    : '0.00';

  // --- 1. CONECTAR CON EL ASISTENTE (Chat) ---
  const handleConsultarIA = async () => {
    if (!userInput) return;
    setIsConsulting(true);
    setChatResponse(""); // Limpiar anterior
    
    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: userInput }),
      });

      if (!res.ok) {
        throw new Error(`Error ${res.status}: ${res.statusText}`);
      }

      const data = await res.json();
      setChatResponse(data.result || data.error || 'Sin respuesta');
    } catch (e) {
      const errorMessage = e instanceof Error ? e.message : 'Error desconocido';
      alert(`Error conectando con el Producer AI: ${errorMessage}`);
      console.error('Error detallado:', e);
    } finally {
    setIsConsulting(false);
    }
  };

  // --- 2. GENERAR CONTENIDO (Música + Imagen) ---
  const handleGenerar = async () => {
    setIsGenerating(true);
    try {
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt: userInput }),
      });

      if (!res.ok) {
        throw new Error(`Error ${res.status}: ${res.statusText}`);
      }

      const data = await res.json();
      setGeneratedContent({ image: data.imageUrl, audio: data.musicUrl });
    } catch (e) {
      const errorMessage = e instanceof Error ? e.message : 'Error desconocido';
      alert(`Error generando los assets: ${errorMessage}`);
      console.error('Error detallado:', e);
    } finally {
    setIsGenerating(false);
    }
  };

  // --- CONTROL DE AUDIO ---
  const toggleAudio = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  // --- 3. MINTeAR NFT (Transacción Real) ---
  const handleMint = async () => {
    if (!isConnected) {
      alert('Por favor, conecta tu wallet primero');
      return;
    }

    try {
      sendTransaction({
        to: MINT_RECIPIENT as `0x${string}`,
        value: parseEther(MINT_AMOUNT),
        chainId: baseSepolia.id,
      });
    } catch (error) {
      console.error('Error al enviar transacción:', error);
      alert('Error al iniciar la transacción. Por favor, intenta de nuevo.');
    }
  };

  // --- 4. MINTeAR CON USDC (Circle) ---
  const handleMintUSDC = async () => {
    if (!isConnected) {
      alert('Por favor, conecta tu wallet primero');
      return;
    }

    if (!MINT_RECIPIENT || MINT_RECIPIENT === '0x0000000000000000000000000000000000000000') {
      alert('Error: Dirección de recepción no configurada. Por favor, configura NEXT_PUBLIC_MINT_RECIPIENT en .env.local');
      return;
    }

    // Verificar balance antes de enviar
    const balance = parseFloat(usdcBalanceFormatted);
    if (balance < parseFloat(MINT_PRICE_USDC)) {
      alert(`Balance insuficiente. Necesitas ${MINT_PRICE_USDC} USDC pero tienes ${usdcBalanceFormatted} USDC.`);
      return;
    }

    try {
      await sendUSDC(MINT_RECIPIENT as `0x${string}`, MINT_PRICE_USDC);
    } catch (error) {
      console.error('Error al enviar USDC:', error);
      alert('Error al enviar USDC. Por favor, verifica tu balance y vuelve a intentar.');
    }
  };

  return (
    <main className="min-h-screen flex flex-col items-center p-4 md:p-10 text-white selection:bg-pink-500 selection:text-black">
      
      {/* --- NAVBAR --- */}
      <nav className="w-full max-w-3xl flex justify-between items-center mb-12 border-b border-white/10 pb-4">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-gradient-to-tr from-pink-500 to-purple-600 pixel-border animate-pulse" />
          <h1 className="text-3xl font-bold tracking-tighter shadow-pink-500 drop-shadow-[0_0_10px_rgba(255,0,255,0.5)]">
            K-BIT <span className="text-cyan-400">IDOLS</span>
          </h1>
        </div>
        
        {/* --- COMPONENTE DE WALLET REAL (OnchainKit) --- */}
        <div className="flex items-center gap-2">
          <Wallet>
            <ConnectWallet className="bg-white/10 hover:bg-white/20 border border-white/20 text-white font-mono text-xs px-4 py-2 rounded-none transition-all">
              <Avatar className="h-6 w-6" />
              <Name className="text-white" />
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
      </nav>

      {/* --- CONTENEDOR PRINCIPAL --- */}
      <div className="w-full max-w-2xl space-y-8">
        
        {/* --- PASO 1: INPUT DEL FAN --- */}
        <div className="relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-pink-600 to-purple-600 rounded-lg blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200"></div>
            <div className="relative bg-black border border-white/20 p-6 shadow-2xl">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-pink-500 font-bold flex items-center gap-2 tracking-widest text-sm">
                        <span className="w-2 h-2 bg-pink-500 rounded-full"></span> 
                        STEP 01: CONCEPTO
                    </h2>
                    {isConsulting && (
                      <div className="flex items-center gap-2">
                        <CircleLoader size="sm" color="cyan" />
                        <span className="text-xs text-cyan-400 animate-pulse">PROCESANDO...</span>
                      </div>
                    )}
                </div>
                
                <textarea
                    value={userInput}
                    onChange={(e) => setUserInput(e.target.value)}
                    placeholder="Describe tu grupo soñado: 'Un grupo de chicas estilo Cyberpunk con bajos pesados y voces dulces...'"
                    className="w-full bg-gray-900/50 border border-white/10 p-4 text-sm focus:border-cyan-400 outline-none h-32 mb-4 text-cyan-100 font-mono"
                />
                
                <div className="flex justify-end">
                    <button 
                        onClick={handleConsultarIA}
                        disabled={isConsulting || !userInput}
                        className="bg-white text-black hover:bg-cyan-400 transition-colors px-6 py-3 text-xs font-bold flex items-center gap-2 border-b-4 border-gray-400 hover:border-white active:border-b-0 active:translate-y-1"
                    >
                        <Sparkles size={16}/> 
                        {isConsulting ? "CONSULTANDO..." : "CONSULTAR PRODUCER AI"}
                    </button>
                </div>

                {/* RESPUESTA DEL ASISTENTE */}
                {chatResponse && (
                    <div className="mt-6 p-4 bg-cyan-950/30 border-l-2 border-cyan-500 text-cyan-200 text-xs whitespace-pre-line leading-relaxed animate-in fade-in slide-in-from-top-2">
                        {chatResponse}
                    </div>
                )}
            </div>
        </div>

        {/* --- PASO 2: GENERACIÓN (Solo visible si hay respuesta) --- */}
        {chatResponse && (
            <div className="relative bg-black border border-white/20 p-6 animate-in slide-in-from-bottom-8 duration-700">
                <h2 className="text-green-400 font-bold mb-6 flex items-center gap-2 tracking-widest text-sm">
                    <span className="w-2 h-2 bg-green-500 rounded-full"></span> 
                    STEP 02: PRODUCCIÓN
                </h2>

                {!generatedContent ? (
                    <button 
                        onClick={handleGenerar}
                        disabled={isGenerating}
                        className="w-full py-6 bg-gradient-to-r from-gray-900 to-black border border-white/20 hover:border-pink-500 hover:shadow-[0_0_20px_rgba(236,72,153,0.3)] transition-all font-bold tracking-[0.2em] text-pink-500 flex justify-center items-center gap-3 group"
                    >
                        {isGenerating ? (
                            <div className="flex items-center gap-3">
                              <CircleLoader size="sm" color="pink" />
                            <span className="animate-pulse">GENERANDO PIXELES Y BEATS...</span>
                            </div>
                        ) : (
                            <>
                                <Zap size={20} className="group-hover:text-cyan-400 transition-colors"/> 
                                GENERAR PREVIEW (GRATIS)
                            </>
                        )}
                    </button>
                ) : (
                    // --- RESULTADO ---
                    <div className="flex flex-col md:flex-row gap-6 items-center bg-white/5 p-4 border border-white/10 scanline overflow-hidden relative">
                        
                        {/* IMAGEN PIXEL ART */}
                        <div className="relative w-48 h-48 bg-black shrink-0 border-2 border-white/10">
                            <img 
                                src={generatedContent.image} 
                                alt="Idol Pixel Art" 
                                className="w-full h-full object-cover pixelated"
                            />
                            {/* Overlay de brillo */}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent pointer-events-none"></div>
                        </div>

                        {/* REPRODUCTOR */}
                        <div className="flex-1 space-y-4 w-full z-10">
                            <div className="flex items-center justify-between border-b border-white/10 pb-2">
                                <div className="flex items-center gap-2 text-pink-400">
                                    <Disc size={18} className={isPlaying ? "animate-spin" : ""} />
                                    <h3 className="font-bold text-sm tracking-widest">PREVIEW_TRACK.mp3</h3>
                                </div>
                                <span className="text-[10px] bg-yellow-400 text-black px-2 py-0.5 font-bold">DEMO MODE</span>
                            </div>
                            
                            {/* Visualizador de Barras */}
                            <div className="flex gap-1 h-12 items-end justify-center bg-black/50 p-2">
                                {[...Array(24)].map((_, i) => (
                                    <div key={i} 
                                         className={`w-1.5 bg-cyan-500/80 transition-all duration-150 ${isPlaying ? 'animate-pulse' : ''}`}
                                         style={{ 
                                            height: isPlaying ? `${Math.random() * 100}%` : '10%',
                                            opacity: isPlaying ? 1 : 0.3 
                                         }}
                                    />
                                ))}
                            </div>

                            <button 
                                onClick={toggleAudio}
                                className="w-full py-3 bg-white text-black font-bold flex justify-center items-center gap-2 hover:bg-cyan-400 hover:text-black transition-colors text-sm tracking-widest"
                            >
                                {isPlaying ? <><Pause size={16}/> PAUSE</> : <><Play size={16}/> PLAY DEMO</>}
                            </button>
                            
                            <audio ref={audioRef} src={generatedContent.audio} onEnded={() => setIsPlaying(false)} />
                        </div>
                    </div>
                )}
            </div>
        )}

        {/* --- PASO 3: MINT NFT (Transacción Real) --- */}
        {generatedContent && (
             <div className="text-center py-8 opacity-60 hover:opacity-100 transition-opacity">
                <p className="text-gray-500 mb-4 text-xs tracking-widest uppercase">
                    ¿Te gusta tu Idol? Adquiérelo para siempre en Base Sepolia
                </p>
                
                {(isConfirmed || isConfirmedUSDC) ? (
                  <div className="bg-green-600 text-white px-8 py-3 rounded-full font-bold flex items-center justify-center gap-2 mx-auto shadow-lg shadow-green-900/50">
                    ✅ MINT EXITOSO! Hash: {(hash || usdcHash)?.slice(0, 10)}...
                  </div>
                ) : (
                  <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                    {/* Botón ETH (Original) */}
                    <button 
                      onClick={handleMint}
                      disabled={!isConnected || isPendingTransaction || isConfirming || isPendingUSDC || isConfirmingUSDC}
                      className="bg-blue-600 hover:bg-blue-500 disabled:bg-gray-600 disabled:cursor-not-allowed text-white px-8 py-3 rounded-full font-bold flex items-center justify-center gap-2 shadow-lg shadow-blue-900/50 transition-all transform hover:scale-105"
                    >
                      {isPendingTransaction || isConfirming ? (
                        <>
                          <CircleLoader size="sm" color="cyan" />
                          {isPendingTransaction ? 'ENVIANDO...' : 'CONFIRMANDO...'}
                        </>
                      ) : (
                        <>
                          <Zap className="w-5 h-5" />
                          MINT CON ETH ({MINT_AMOUNT} ETH)
                        </>
                      )}
                    </button>

                    {/* Botón Circle USDC (Integración Completa) */}
                    <button 
                      onClick={handleMintUSDC}
                      disabled={!isConnected || isPendingUSDC || isConfirmingUSDC || isPendingTransaction || isConfirming}
                      className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 disabled:bg-gray-600 disabled:cursor-not-allowed text-white px-8 py-3 rounded-full font-bold flex items-center justify-center gap-2 shadow-lg shadow-purple-900/50 transition-all transform hover:scale-105"
                    >
                      {isPendingUSDC || isConfirmingUSDC ? (
                        <>
                          <CircleLoader size="sm" color="pink" />
                          {isPendingUSDC ? 'ENVIANDO USDC...' : 'CONFIRMANDO...'}
                        </>
                      ) : (
                        <>
                          <div className="w-5 h-5 rounded-full bg-white flex items-center justify-center">
                            <span className="text-purple-600 font-bold text-xs">C</span>
                          </div>
                          MINT CON USDC (1 USDC)
                        </>
                      )}
                </button>
                  </div>
                )}
                
                {(sendError || usdcError) && (
                  <p className="text-red-400 text-xs mt-2">
                    Error: {sendError?.message || usdcError}
                  </p>
                )}
                
                {!isConnected && (
                  <p className="text-yellow-400 text-xs mt-2">
                    ⚠️ Conecta tu wallet para continuar
                  </p>
                )}
                
                <p className="text-gray-400 text-[10px] mt-4 max-w-md mx-auto">
                  💡 USDC en Base Sepolia: Contrato 0x036CbD53842c5426634e7929541eC2318f3dCF7e
                </p>
             </div>
        )}

      </div>
    </main>
  );
}
