'use client';

import React, { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useBlockchainStore, GasPoint } from '../utils/store';
import CandlestickChart from '@/components/chart';
import { Input } from '@/components/ui/input';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { ethers } from 'ethers';
import { Pool } from '@uniswap/v3-sdk';
import { Token } from '@uniswap/sdk-core';
import { CandlestickData, UTCTimestamp } from 'lightweight-charts';
import Header from '@/components/Header';

// Actual inner page that uses hooks
const PageContent = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const blockchainState = useBlockchainStore();
  const currentChain = blockchainState.blockchain;

  const [ethUsdPrice, setEthUsdPrice] = useState<number | null>(null);
  const [gasLimit, setGasLimit] = useState('21000'); 
  const [estimatedFee, setEstimatedFee] = useState<string | null>(null);

  useEffect(() => {
    const chainFromUrl = searchParams.get('chain');
    const allowedChains = ['ethereum', 'arbitrum', 'polygon'];
    if (chainFromUrl && allowedChains.includes(chainFromUrl)) {
      blockchainState.changeBlockchain(chainFromUrl as 'ethereum' | 'arbitrum' | 'polygon');
    } else {
      router.push('/');
    }
  }, [searchParams, router, blockchainState.changeBlockchain]);

  useEffect(() => {
    const getEthUsdPrice = async () => {
      try {
        const abi = [
          'function slot0() view returns (uint160 sqrtPriceX96, int24 tick, uint16 observationIndex, uint16 observationCardinality, uint16 observationCardinalityNext, uint8 feeProtocol, bool unlocked)',
          'function liquidity() view returns (uint128)',
        ];
        const provider = new ethers.JsonRpcProvider(`https://eth-mainnet.g.alchemy.com/v2/${process.env.NEXT_PUBLIC_API_KEY}`);
        const poolAddress = '0x88e6A0c2dDD26FEEb64F039a2c41296FcB3f5640';

        const USDC = new Token(1, '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48', 6, 'USDC');
        const WETH = new Token(1, '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2', 18, 'WETH');

        const poolContract = new ethers.Contract(poolAddress, abi, provider);
        const [slot0, liquidity] = await Promise.all([
          poolContract.slot0(),
          poolContract.liquidity(),
        ]);

        const { sqrtPriceX96, tick } = slot0;
        const pool = new Pool(USDC, WETH, 500, sqrtPriceX96.toString(), liquidity.toString(), Number(tick));
        return pool.token1Price.toSignificant(6);
      } catch (err) {
        console.error('Failed to fetch ETH/USD price:', err);
        return null;
      }
    };

    getEthUsdPrice().then((price) => {
      if (price) setEthUsdPrice(Number(price));
    });
  }, []);

  const handleEstimate = () => {
    setEstimatedFee(null);

    if (currentChain !== 'ethereum') {
      setEstimatedFee("Estimation is only available for Ethereum.");
      return;
    }

    const chainData = blockchainState.chains.ethereum;
    if (!chainData || !ethUsdPrice || !gasLimit) {
      setEstimatedFee("Data not available. Please wait.");
      return;
    }

    try {
      const gasPricePerUnit = chainData.baseFee + chainData.priorityFee;
      const totalFeeInWei = gasPricePerUnit * BigInt(gasLimit);
      const totalFeeInEth = ethers.formatEther(totalFeeInWei);
      const feeInUsd = parseFloat(totalFeeInEth) * ethUsdPrice;
      setEstimatedFee(`Estimated Fee: $${feeInUsd.toFixed(2)}`);
    } catch (e) {
      console.error("Calculation error:", e);
      setEstimatedFee("Error calculating fee.");
    }
  };

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
    setEstimatedFee(null);
    router.push(`/simulation?chain=${chain}`);
  };

  return (
    <div>
      <div className="text-center text-3xl mt-[10vh] flex justify-center items-center gap-4">
        <div>Simulate a Transaction on:</div>
        <DropdownMenu>
          <DropdownMenuTrigger className="select-none capitalize text-blue-500 font-semibold border px-4 py-2 rounded-md">
            {currentChain}
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuLabel>Select Blockchain</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onSelect={() => handleChainChange('ethereum')}>Ethereum</DropdownMenuItem>
            <DropdownMenuItem onSelect={() => handleChainChange('arbitrum')}>Arbitrum</DropdownMenuItem>
            <DropdownMenuItem onSelect={() => handleChainChange('polygon')}>Polygon</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div className="flex flex-col items-center gap-3 text-center mt-3">
        <div className="flex items-center gap-3">
          <Input
            className="w-48"
            placeholder="Enter Gas Limit"
            value={gasLimit}
            onChange={(e) => setGasLimit(e.target.value)}
          />
          <Button onClick={handleEstimate}>Estimate Fee</Button>
        </div>
        {estimatedFee && (
          <div className='w-full text-blue-500 text-center font-semibold text-lg'>
            {estimatedFee}
          </div>
        )}
      </div>

      <div className="mt-8">
        <CandlestickChart data={chartData} />
      </div>
    </div>
  );
};

const Page = () => (
  <Suspense fallback={<div className="text-center mt-10 text-gray-400">Loading ...</div>}>
    <Header></Header>
    <PageContent />
  </Suspense>
);

export default Page;