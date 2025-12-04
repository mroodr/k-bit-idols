// components/providers/Web3Provider.tsx - VERSIÓN SIMPLE
'use client';

import { OnchainKitProvider } from '@coinbase/onchainkit';
import { WagmiProvider } from 'wagmi';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { config } from '@/lib/wagmi';
import { Toaster } from 'sonner';

// Solo para el hackathon, usa esto
const queryClient = new QueryClient();

export function Web3Provider({ children }: { children: React.ReactNode }) {
    return (
        <WagmiProvider config={config}>
            <QueryClientProvider client={queryClient}>
                <OnchainKitProvider
                    apiKey="test-key" // Para hackathon está bien
                    chain={config.chains[0]}
                >
                    {children}
                    <Toaster theme="dark" />
                </OnchainKitProvider>
            </QueryClientProvider>
        </WagmiProvider>
    );
}