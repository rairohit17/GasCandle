import { create } from 'zustand';

type BlockchainState = {
  blockchain: string;
  changeBlockchain: (newOne: string) => void;
};

const useBlockchain = create<BlockchainState>((set) => ({
  blockchain: 'ethereum',
  changeBlockchain: (newOne) => set({ blockchain: newOne }),
}));

export default useBlockchain;