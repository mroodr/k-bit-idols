import { NextResponse } from 'next/server';
import OpenAI from 'openai';

// Configuración condicional: Solo intenta conectar si hay clave
const openai = process.env.OPENAI_API_KEY 
  ? new OpenAI({ apiKey: process.env.OPENAI_API_KEY }) 
  : null;

export async function POST(req: Request) {
  const { message } = await req.json();
  
  // LEER EL INTERRUPTOR
  const useMock = process.env.USE_MOCK_DATA === 'true';

  // --- MODO SIMULACIÓN (GRATIS) ---
  if (useMock) {
    console.log("Modo Simulación: Chat");
    await new Promise(resolve => setTimeout(resolve, 1500)); // Espera falsa
    return NextResponse.json({ 
      result: `[SIMULACIÓN] ¡Entendido! Basado en "${message}", he diseñado este concepto:
      
      🔥 GÉNERO: Cyberpunk K-Pop / Girl Crush
      🎹 BPM: 128 (Energético)
      🎤 VOCALES: Estilo rap agresivo + Coro melódico
      🎨 VISUAL: Neón, Luces de ciudad, Glitch art.
      
      (Cambia USE_MOCK_DATA=false en .env para usar IA real)` 
    });
  }

  // --- MODO REAL (PAGADO) ---
  try {
    if (!openai) throw new Error("No hay API Key de OpenAI");

    const systemPrompt = `Eres un productor experto de K-Pop para la agencia K-Bit Idols.
    Tu objetivo es ayudar al usuario a definir un estilo musical.
    Sé breve, entusiasta y usa jerga K-pop (Bias, Comeback, MV).
    Al final, sugiere parámetros técnicos (BPM, Instrumentos, Género).`;

    const completion = await openai.chat.completions.create({
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: message }
      ],
      model: "gpt-4o-mini",
    });

    return NextResponse.json({ result: completion.choices[0].message.content });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Error en OpenAI' }, { status: 500 });
  }
}