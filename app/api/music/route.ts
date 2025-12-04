import { NextResponse } from 'next/server';
import Replicate from "replicate";

// Inicializamos Replicate con tu token del .env.local
const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN,
});

export async function POST(req: Request) {
  try {
    const { prompt } = await req.json();

    console.log("--- INTENTO DE GENERACIÓN (VIA REPLICATE) ---");
    console.log("Prompt recibido:", prompt);

    // 1. Estilo forzado (Mantenemos tu lógica original)
    const enhancedPrompt = `8-bit chiptune style, retro video game music, nintendo style, ${prompt}`;

    // 2. Ejecutar el modelo en Replicate
    // Usamos 'meta/musicgen' configurado en 'stereo-small' para máxima velocidad
    const output = await replicate.run(
      "meta/musicgen:671ac645ce5e552cc63a54a2bbff63fcf798043055d2dac5fc9e36a837eedcfb",
      {
        input: {
          prompt: enhancedPrompt,
          model_version: "stereo-small", // Versión ligera
          duration: 8,                   // Duración en segundos (ajustable)
          continuation: false
        }
      }
    );

    console.log("✅ Replicate respondió con URL:", output);

    // 3. Replicate devuelve una URL, pero tu frontend espera el archivo de audio (Buffer).
    //    Así que el servidor descarga el audio temporalmente.
    if (!output) {
      throw new Error("Replicate no devolvió ninguna URL de audio.");
    }

    // Convertimos el output (que puede ser un string o array) a string URL
    const audioUrl = String(output);
    
    // Descargamos el archivo de la URL de Replicate
    const audioResponse = await fetch(audioUrl);
    if (!audioResponse.ok) {
      throw new Error("Error al descargar el audio desde Replicate");
    }

    const audioBuffer = await audioResponse.arrayBuffer();

    // 4. Enviamos el audio al frontend como siempre
    return new NextResponse(audioBuffer, {
      headers: { 
        "Content-Type": "audio/mpeg",
        "Content-Length": audioBuffer.byteLength.toString()
      },
    });

  } catch (error: any) {
    console.error("🚨 Error crítico:", error);
    // Manejo de errores específico de Replicate
    if (error.response?.status === 401) {
        return NextResponse.json({ error: "Token de Replicate inválido o no configurado." }, { status: 401 });
    }
    if (error.message.includes("NSFW")) {
        return NextResponse.json({ error: "Contenido no permitido detectado." }, { status: 400 });
    }
    
    return NextResponse.json({ error: error.message || "Error interno del servidor" }, { status: 500 });
  }
}