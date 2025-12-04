'use client';

import { useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { parseUnits } from 'viem';
import { baseSepolia } from 'wagmi/chains';
import { USDC_CONTRACT_BASE_SEPOLIA, USDC_ABI } from '../lib/usdc';

export function useCirclePayment() {
  const {
    writeContract,
    data: hash,
    isPending,
    error: writeError,
  } = useWriteContract();

  const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({
    hash,
  });

  const sendUSDC = async (recipient: `0x${string}`, amount: string) => {
    try {
      // Convertir el monto a la unidad más pequeña (USDC tiene 6 decimales)
      const amountInWei = parseUnits(amount, 6);

      writeContract({
        address: USDC_CONTRACT_BASE_SEPOLIA,
        abi: USDC_ABI,
        functionName: 'transfer',
        args: [recipient, amountInWei],
        chainId: baseSepolia.id,
      });
    } catch (error) {
      console.error('Error al enviar USDC:', error);
      throw error;
    }
  };

  return {
    sendUSDC,
    hash,
    isPending,
    isConfirming,
    isConfirmed,
    error: writeError?.message || null,
  };
}
