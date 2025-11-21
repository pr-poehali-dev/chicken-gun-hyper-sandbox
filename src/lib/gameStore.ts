import { create } from 'zustand';

interface Player {
  id: string;
  nickname: string;
  position: { x: number; y: number; z: number };
  rotation: number;
  health: number;
  is_shooting: boolean;
  color: string;
}

interface Block {
  id: string;
  position: { x: number; y: number; z: number };
  type: string;
  placed_by: string;
}

interface Bullet {
  id: string;
  position: { x: number; y: number; z: number };
  direction: { x: number; y: number; z: number };
  shooter_id: string;
}

interface GameState {
  playerId: string | null;
  nickname: string;
  players: Player[];
  blocks: Block[];
  bullets: Bullet[];
  connected: boolean;
  gameServerUrl: string;
  
  setPlayerId: (id: string) => void;
  setNickname: (nickname: string) => void;
  setPlayers: (players: Player[]) => void;
  setBlocks: (blocks: Block[]) => void;
  setBullets: (bullets: Bullet[]) => void;
  setConnected: (connected: boolean) => void;
  addBlock: (block: Block) => void;
  updatePlayerPosition: (id: string, position: { x: number; y: number; z: number }, rotation: number) => void;
}

export const useGameStore = create<GameState>((set) => ({
  playerId: null,
  nickname: '',
  players: [],
  blocks: [],
  bullets: [],
  connected: false,
  gameServerUrl: 'https://functions.poehali.dev/f08120b2-0325-49fe-855e-b604e337fdf8',
  
  setPlayerId: (id) => set({ playerId: id }),
  setNickname: (nickname) => set({ nickname }),
  setPlayers: (players) => set({ players }),
  setBlocks: (blocks) => set({ blocks }),
  setBullets: (bullets) => set({ bullets }),
  setConnected: (connected) => set({ connected }),
  addBlock: (block) => set((state) => ({ blocks: [...state.blocks, block] })),
  updatePlayerPosition: (id, position, rotation) =>
    set((state) => ({
      players: state.players.map((p) =>
        p.id === id ? { ...p, position, rotation } : p
      ),
    })),
}));
