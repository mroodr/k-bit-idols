import { NextResponse } from 'next/server';
import Replicate from 'replicate';

const replicate = process.env.REPLICATE_API_TOKEN
  ? new Replicate({ auth: process.env.REPLICATE_API_TOKEN })
  : null;

export async function POST(req: Request) {
  const { prompt } = await req.json();

  // LEER EL INTERRUPTOR
  const useMock = process.env.USE_MOCK_DATA === 'true';

  // --- MODO SIMULACIÓN (GRATIS) ---
  if (useMock) {
    console.log("Modo Simulación: Generación");
    await new Promise(resolve => setTimeout(resolve, 3000)); // Espera falsa
    
    // Generamos un avatar pixelado aleatorio basado en el texto
    const seed = prompt.replace(/\s/g, ''); 
    
    return NextResponse.json({ 
      imageUrl: `https://api.dicebear.com/9.x/pixel-art/png?seed=${seed}`,
      musicUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3" 
    });
  }

  // --- MODO REAL (PAGADO) ---
  try {
    if (!replicate) throw new Error("No hay API Key de Replicate");

    // 1. Música real (MusicGen)
    const musicOutput = await replicate.run(
      "meta/musicgen:b05b1dff1d8c6dc63d14b0cdb42135378dcb87f6373b0d3d341ede46e59e2b38",
      {
        input: {
          prompt: `K-Pop style, ${prompt}`,
          duration: 15 
        }
      }
    );

    // 2. Imagen real (SDXL Pixel Art)
    const imageOutput = await replicate.run(
      "stability-ai/sdxl:39ed52f2a78e934b3ba6e2a89f5b1c712de7dfea535525255b1aa35c5565e08b",
      {
        input: {
          prompt: `pixel art style, 8-bit, retro game character, k-pop idol, ${prompt}, vibrant neon colors`,
          width: 768,
          height: 768,
          refine: "expert_ensemble_refiner"
        }
      }
    );

    // Replicate a veces devuelve array o string, normalizamos:
    const finalImage = Array.isArray(imageOutput) ? imageOutput[0] : imageOutput;
    const finalMusic = Array.isArray(musicOutput) ? musicOutput[0] : musicOutput;

    return NextResponse.json({ 
      musicUrl: finalMusic, 
      imageUrl: finalImage 
    });

  } catch (error) {
    console.error('Replicate error:', error);
    const message = error instanceof Error ? error.message : String(error);
    return NextResponse.json({ error: `Error en Replicate: ${message}` }, { status: 500 });
  }
}