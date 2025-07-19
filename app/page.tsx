'use client';
import Link from 'next/link';

import { useState } from 'react';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
export default function Home() {
  const [selectedChain, setSelectedChain] = useState('ethereum');

  return (
    <div>
      
      <main className="min-h-screen w-full mt-[30px] px-[30px] select-none">
        <div className="mt-[100px]">
          <h2 className="md:max-w-[60vw] stroke text-[2.5rem] text-blue-800 md:text-[3.5rem] transition duration-100  font-bold cursor-pointer">
            Know your transaction cost before you send.
          </h2>
        </div>
        <div className="mt-[80px]">
          <div className="block text-2xl font-medium text-gray-600  text-center mb-[30px]">
            Select Blockchain
          </div>
          <ToggleGroup
            type="single"
            variant="outline"
            value={selectedChain}
            onValueChange={(val) => {
              if (val) setSelectedChain(val);
            }}
            className="flex flex-wrap justify-center gap-4"
          >
            <ToggleGroupItem
              className={`w-[200px] border-blue-500 hover:text-white hover:bg-blue-500 text-gray-800 data-[state=on]:bg-blue-500 data-[state=on]:text-white`}
              value="ethereum"
              aria-label="Toggle Ethereum"
            >
              Ethereum
            </ToggleGroupItem>
            <ToggleGroupItem
              className={`w-[200px] border-pink-600 hover:text-white hover:bg-pink-600  text-gray-800 data-[state=on]:bg-pink-600 data-[state=on]:text-white`}
              value="arbitrum"
              aria-label="Toggle Arbitrum"
            >
              Arbitrum
            </ToggleGroupItem>
            <ToggleGroupItem
              className={`w-[200px] border-purple-700 text-gray-800 hover:bg-purple-700 hover:text-white data-[state=on]:bg-purple-700 data-[state=on]:text-white`}
              value="polygon"
              aria-label="Toggle Polygon"
            >
              Polygon
            </ToggleGroupItem>
          </ToggleGroup>

          <p className="text-center mt-4 text-sm text-gray-400">
            Selected: <span className="font-semibold">{selectedChain}</span>
          </p>
        </div>
        <div className="mt-[50px]">
          <h3 className="text-2xl font-semibold mb-[30px] text-gray-600 text-center">
            Choose Mode
          </h3>
          <div className="flex flex-col md:flex-row  md:justify-center  gap-6">
            <Link href={`/live?chain=${selectedChain}`}>
              <div className="border border-blue-300 p-6 h-[150px] rounded-xl shadow-md hover:shadow-lg hover:border-blue-500 transition w-full md:w-[300px] cursor-pointer">
                <h4 className="text-xl font-bold text-blue-700">Live Mode</h4>
                <p className="text-sm text-gray-600 mt-2">
                  Real-time gas prices & cost preview. Updates every 6s with
                  candle chart every 15min.
                </p>
              </div>
            </Link>

            <Link href={`/simulation?chain=${selectedChain}`}>
              <div className="border border-purple-300 p-6 rounded-xl h-[150px] mb-[50px] shadow-md hover:shadow-lg hover:border-purple-500 transition w-full md:w-[300px] cursor-pointer">
                <h4 className="text-xl font-bold text-purple-700">
                  Simulation Mode
                </h4>
                <p className="text-sm text-gray-600 mt-2">
                  Simulate a transaction and get cost in USD using current gas
                  data.
                </p>
              </div>
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
