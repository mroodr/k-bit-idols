// Constantes para USDC en Base Sepolia
export const USDC_CONTRACT_BASE_SEPOLIA = '0x036CbD53842c5426634e7929541eC2318f3dCF7e' as `0x${string}`;

// ABI mínimo para transferir USDC (ERC-20)
export const USDC_ABI = [
  {
    inputs: [
      { name: 'to', type: 'address', internalType: 'address' },
      { name: 'amount', type: 'uint256', internalType: 'uint256' },
    ],
    name: 'transfer',
    outputs: [{ name: '', type: 'bool', internalType: 'bool' }],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [{ name: 'account', type: 'address', internalType: 'address' }],
    name: 'balanceOf',
    outputs: [{ name: '', type: 'uint256', internalType: 'uint256' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'decimals',
    outputs: [{ name: '', type: 'uint8', internalType: 'uint8' }],
    stateMutability: 'view',
    type: 'function',
  },
] as const;

// Precio de mint en USDC
export const MINT_PRICE_USDC = '1'; // 1 USDC
