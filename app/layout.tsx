'use client';
import Header from '../components/Header';
import { useEffect } from 'react';
import { ethers } from 'ethers';
import { useBlockchainStore } from './utils/store'; 
import './globals.css';

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  useEffect(() => {
    const RPCS: Record<'ethereum' | 'polygon' | 'arbitrum', string> = {
      ethereum: `wss://eth-mainnet.g.alchemy.com/v2/${process.env.NEXT_PUBLIC_API_KEY}`,
      polygon: `wss://polygon-mainnet.g.alchemy.com/v2/${process.env.NEXT_PUBLIC_API_KEY}`,
      arbitrum: `wss://arb-mainnet.g.alchemy.com/v2/${process.env.NEXT_PUBLIC_API_KEY}`,
    };

    const priorityFees: Record<'ethereum' | 'polygon' | 'arbitrum', bigint> = {
      ethereum: BigInt(2_000_000_000), // 2 Gwei
      polygon: BigInt(40_000_000_000), // 40 Gwei
      arbitrum: BigInt(300_000_000), // 0.3 Gwei
    };

    const providers: Record<string, ethers.WebSocketProvider> = {};
    const chainsToSetup: ('ethereum' | 'polygon' | 'arbitrum')[] = ['ethereum', 'polygon', 'arbitrum'];

    const setup = (chain: 'ethereum' | 'polygon' | 'arbitrum') => {
      const provider = new ethers.WebSocketProvider(RPCS[chain]);
      providers[chain] = provider;

      provider.on('block', async (blockNumber) => {
        const block = await provider.getBlock(blockNumber);
        if (!block?.baseFeePerGas) return;

        const baseFee = block.baseFeePerGas;
        const priorityFee = priorityFees[chain];

        useBlockchainStore.getState().updateFees(chain, baseFee, priorityFee);
      });

    };

 
    chainsToSetup.forEach(setup);

 
    const bufferInterval = setInterval(() => {
      const state = useBlockchainStore.getState();

      chainsToSetup.forEach((chain) => {
        const data = state.chains[chain];
    
        if (data.baseFee === BigInt(0)) return;

        const totalFee = data.baseFee + data.priorityFee;

        const point = {
          time: Math.floor(Date.now() / 1000),
          open: totalFee,
          high: totalFee,
          low: totalFee,
          close: totalFee,
        };

        state.addToBuffer(chain, point);
        // console.log(state.chains)
      });
    }, 6000); // Every 6s

    const historyInterval = setInterval(() => {
      const state = useBlockchainStore.getState();

      chainsToSetup.forEach((chain) => {
        const buffer = state.chains[chain].buffer;
        if (buffer.length === 0) return;

        
        const open = buffer[0].open;
        const close = buffer[buffer.length - 1].close;
        const high = buffer.reduce((max, p) => (p.high > max ? p.high : max), buffer[0].high);
        const low = buffer.reduce((min, p) => (p.low < min ? p.low : min), buffer[0].low);

        const summarizedPoint = {
          time: Math.floor(Date.now() / 1000), 
          open,
          high,
          low,
          close,
        };
        
        
        state.addGasPoint(chain, summarizedPoint);
        state.setBuffer(chain, []); 
      });
    }, 1 * 60 * 1000); // Every 15m

    
    return () => {
      Object.values(providers).forEach((p) => {
        p.removeAllListeners();
        
        p.destroy();
      });
      clearInterval(bufferInterval);
      clearInterval(historyInterval);
    };
  }, []); 

  return (
    <html lang="en" className="light">
      <body className="bg-background bg-cover bg-center w-full min-h-screen">
        <main className="relative flex min-h-screen flex-col">
          <div>
            <Header />
          </div>
          {children}
        </main>
      </body>
    </html>
  );
}