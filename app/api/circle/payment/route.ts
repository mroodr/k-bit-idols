import { NextResponse } from 'next/server';

// Circle API Integration para pagos con USDC
// Documentación: https://developers.circle.com/

const CIRCLE_API_KEY = process.env.CIRCLE_API_KEY;
const CIRCLE_API_URL = process.env.CIRCLE_API_URL || 'https://api.circle.com/v1';

export async function POST(req: Request) {
  try {
    const { amount, recipientAddress, token = 'USDC' } = await req.json();

    if (!CIRCLE_API_KEY) {
      return NextResponse.json(
        { error: 'Circle API Key no configurada' },
        { status: 500 }
      );
    }

    // En producción, usarías la API de Circle para crear un payment intent
    // Por ahora, retornamos los datos para que el frontend maneje la transacción
    
    return NextResponse.json({
      success: true,
      paymentData: {
        amount,
        recipientAddress,
        token,
        chainId: 84532, // Base Sepolia
        contractAddress: '0x036CbD53842c5426634e7929541eC2318f3dCF7e', // USDC Base Sepolia
      },
      message: 'Payment intent creado. Usa wagmi para ejecutar la transacción.',
    });

  } catch (error) {
    console.error('Error en Circle Payment API:', error);
    return NextResponse.json(
      { error: 'Error procesando el pago con Circle' },
      { status: 500 }
    );
  }
}

