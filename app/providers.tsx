// app/providers.tsx
'use client';

import { OnchainKitProvider } from '@coinbase/onchainkit';
import { WagmiProvider } from 'wagmi';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { baseSepolia } from 'wagmi/chains'; 
import { config } from '@/lib/wagmi'; // Asegúrate que esta ruta coincida con tu archivo lib/wagmi.ts
import { ReactNode, useState } from 'react';

export function Providers({ children }: { children: ReactNode }) {
  // Usamos useState para asegurar que el QueryClient sea estable entre renderizados
  const [queryClient] = useState(() => new QueryClient());

  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <OnchainKitProvider
          apiKey={process.env.NEXT_PUBLIC_ONCHAINKIT_API_KEY} // Opcional para pruebas, obligatorio para prod
          chain={baseSepolia}
        >
          {children}
        </OnchainKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}