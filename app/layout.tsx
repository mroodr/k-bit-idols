import './globals.css';
import type { Metadata } from 'next';
import { Providers } from './components/Providers'; 
import '@coinbase/onchainkit/styles.css'; 

export const metadata: Metadata = {
  title: 'K-Bit Idols',
  description: 'AI K-Pop Generator on Base',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}