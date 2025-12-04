// lib/wagmi.ts
import { http, createConfig } from 'wagmi';
import { baseSepolia } from 'wagmi/chains';
import { coinbaseWallet, injected, walletConnect } from 'wagmi/connectors';

// Configuración de Base Sepolia
export const config = createConfig({
    chains: [baseSepolia],
    connectors: [
        coinbaseWallet({
            appName: 'K-Bit Idols',
            appChainIds: [baseSepolia.id],
            preference: 'all',
        }),
        injected(),
        walletConnect({
            projectId: process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID || 'test-id',
        }),
    ],
    ssr: true,
    transports: {
        [baseSepolia.id]: http('https://sepolia.base.org'),
    },
    multiInjectedProviderDiscovery: true,
});