// app/live/LiveGasChart.tsx
'use client';

import React, { Suspense, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useBlockchainStore, GasPoint } from '../utils/store';
import CandlestickChart from '@/components/chart';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { CandlestickData, UTCTimestamp } from 'lightweight-charts';

const LiveGasChart = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const blockchainState = useBlockchainStore();
  const currentChain = blockchainState.blockchain;

  useEffect(() => {
    const chainFromUrl = searchParams.get('chain');
    const allowedChains = ['ethereum', 'arbitrum', 'polygon'];
    if (chainFromUrl && allowedChains.includes(chainFromUrl)) {
      blockchainState.changeBlockchain(chainFromUrl as 'ethereum' | 'arbitrum' | 'polygon');
    } else {
      router.push('/');
    }
  }, [searchParams, router, blockchainState.changeBlockchain]);

  const history: GasPoint[] = blockchainState.chains[currentChain]?.history || [];

  const chartData: CandlestickData[] = history.map((point) => ({
    time: point.time as UTCTimestamp,
    open: Number(point.open),
    high: Number(point.high),
    low: Number(point.low),
    close: Number(point.close),
  }));

  const handleChainChange = (chain: 'ethereum' | 'arbitrum' | 'polygon') => {
    blockchainState.changeBlockchain(chain);
    router.push(`/live?chain=${chain}`);
  };

  return (
    <div>
      <div className="text-center text-3xl mt-[10vh] flex justify-center items-center gap-4">
        <div>Live Gas Fees:</div>
        <DropdownMenu>
          <DropdownMenuTrigger className="select-none capitalize text-blue-500 font-semibold border px-4 py-2 rounded-md">
            {currentChain}
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuLabel>Select Blockchain</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onSelect={() => handleChainChange('ethereum')}>
              Ethereum
            </DropdownMenuItem>
            <DropdownMenuItem onSelect={() => handleChainChange('arbitrum')}>
              Arbitrum
            </DropdownMenuItem>
            <DropdownMenuItem onSelect={() => handleChainChange('polygon')}>
              Polygon
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <div className="mt-8">
        <CandlestickChart data={chartData} />
      </div>
    </div>
  );
};

export default function Page() {
  return (
    <Suspense fallback={<div className="text-center mt-20">Loading Live Data...</div>}>
      <LiveGasChart />
    </Suspense>
  );
}
