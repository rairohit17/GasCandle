'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation'; // App Router
import { useSearchParams } from 'next/navigation';
import CandlestickChart from '@/components/chart';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import useBlockchain from '../utils/store';
const Page = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const chain = searchParams.get('chain');
  const blockchainState  =  useBlockchain();
  useEffect(() => {
    const allowedChains = ['ethereum', 'arbitrum', 'polygon'];
    blockchainState.changeBlockchain(chain as string);
    if (!chain || !allowedChains.includes(chain)) {
      router.push('/');
    }
  }, [chain, router]); // Dependency array

  return (
    <div className="">
      <div className="text-center text-3xl mt-[20vh] flex justify-center  gap-7">
        <div>Live Mode :  </div>
        <div>
          <DropdownMenu>
            <DropdownMenuTrigger className='select-none'>{(blockchainState.blockchain)}</DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuLabel>Select Blockchain</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onSelect={()=>{
                blockchainState.changeBlockchain("ethereum")
                router.push("/live?chain=ethereum")
              }}>ethereum</DropdownMenuItem>
              <DropdownMenuItem onSelect={()=>{
                blockchainState.changeBlockchain("arbitrum")
                router.push("/live?chain=arbitrum")
              }}>arbitrum</DropdownMenuItem>
              <DropdownMenuItem onSelect={()=>{
                blockchainState.changeBlockchain("polygon")
                router.push("/live?chain=polygon")
              }}>polygon</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      <div className=" ">
        <CandlestickChart></CandlestickChart>
      </div>
    </div>
  );
};

export default Page;
