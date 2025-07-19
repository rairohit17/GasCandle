'use client';

import { create } from 'zustand';

export type GasPoint = {
  time: number; 
  open: bigint;
  high: bigint;
  low: bigint;
  close: bigint;
};

type ChainGasData = {
  baseFee: bigint;
  priorityFee: bigint;
  history: GasPoint[];
  buffer: GasPoint[];
};

type ChainKey = 'ethereum' | 'polygon' | 'arbitrum';

type BlockchainState = {
  blockchain: ChainKey;
  changeBlockchain: (newChain: ChainKey) => void;

  chains: Record<ChainKey, ChainGasData>;

  updateFees: (chain: ChainKey, baseFee: bigint, priorityFee: bigint) => void;

  addGasPoint: (chain: ChainKey, point: GasPoint) => void;

  setBuffer: (chain: ChainKey, buffer: GasPoint[]) => void;

  addToBuffer: (chain: ChainKey, point: GasPoint) => void;
};

export const useBlockchainStore = create<BlockchainState>((set) => ({
  blockchain: 'ethereum',
  changeBlockchain: (newChain) => set({ blockchain: newChain }),

  chains: {
    ethereum: { baseFee: BigInt(0), priorityFee: BigInt(0), history: [], buffer: [] },
    polygon: { baseFee: BigInt(0), priorityFee: BigInt(0), history: [], buffer: [] },
    arbitrum: { baseFee: BigInt(0), priorityFee: BigInt(0), history: [], buffer: [] },
  },

  updateFees: (chain, baseFee, priorityFee) =>
    set((state) => ({
      chains: {
        ...state.chains,
        [chain]: {
          ...state.chains[chain],
          baseFee,
          priorityFee,
        },
      },
    })),

  addGasPoint: (chain, point) =>
    set((state) => ({
      chains: {
        ...state.chains,
        [chain]: {
          ...state.chains[chain],
          history: [...state.chains[chain].history, point],
        },
      },
    })),

  setBuffer: (chain, buffer) =>
    set((state) => ({
      chains: {
        ...state.chains,
        [chain]: {
          ...state.chains[chain],
          buffer,
        },
      },
    })),

  addToBuffer: (chain, point) =>
    set((state) => ({
      chains: {
        ...state.chains,
        [chain]: {
          ...state.chains[chain],
          buffer: [...state.chains[chain].buffer, point],
        },
      },
    })),
}));