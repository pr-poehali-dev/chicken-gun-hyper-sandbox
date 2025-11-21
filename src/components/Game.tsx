import { Canvas } from '@react-three/fiber';
import { Sky, PointerLockControls } from '@react-three/drei';
import { Physics } from '@react-three/cannon';
import Player from './game/Player';
import Ground from './game/Ground';
import Terrain from './game/Terrain';
import OtherPlayers from './game/OtherPlayers';
import Blocks from './game/Blocks';
import Bullets from './game/Bullets';
import UI from './game/UI';
import MobileControls from './game/MobileControls';
import { useGameStore } from '@/lib/gameStore';
import { useEffect, useState, useRef } from 'react';

const Game = () => {
  const { connected, gameServerUrl, playerId, setPlayers, setBlocks, setBullets, addBlock } = useGameStore();
  const [mobileInput, setMobileInput] = useState({ x: 0, y: 0 });
  const playerActionsRef = useRef({
    jump: () => {},
    shoot: () => {},
    build: () => {},
  });

  useEffect(() => {
    if (!connected || !playerId) return;

    const interval = setInterval(async () => {
      try {
        const response = await fetch(gameServerUrl);
        const data = await response.json();
        
        setPlayers(data.players || []);
        setBlocks(data.blocks || []);
        setBullets(data.bullets || []);
      } catch (error) {
        console.error('Failed to sync game state:', error);
      }
    }, 100);

    return () => clearInterval(interval);
  }, [connected, playerId, gameServerUrl, setPlayers, setBlocks, setBullets]);

  if (!connected) {
    return null;
  }

  const handleBuild = async () => {
    if (!playerId) return;
    
    try {
      await fetch(gameServerUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'place_block',
          playerId,
          position: { x: Math.floor(Math.random() * 10), y: 1, z: Math.floor(Math.random() * 10) },
          blockType: 'cube',
        }),
      });
    } catch (error) {
      console.error('Failed to place block:', error);
    }
  };

  return (
    <div className="w-full h-screen">
      <Canvas camera={{ fov: 60 }}>
        <Sky sunPosition={[100, 20, 100]} />
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} />
        
        <Physics gravity={[0, -20, 0]}>
          <Player mobileInput={mobileInput} />
          <Ground />
          <Terrain />
          <OtherPlayers />
          <Blocks />
        </Physics>
        
        <Bullets />
        
        <PointerLockControls />
      </Canvas>
      <UI />
      <MobileControls
        onMove={setMobileInput}
        onJump={() => {}}
        onShoot={() => {}}
        onBuild={handleBuild}
      />
    </div>
  );
};

export default Game;