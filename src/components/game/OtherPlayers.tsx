import { useGameStore } from '@/lib/gameStore';
import { Text } from '@react-three/drei';

const OtherPlayers = () => {
  const { players, playerId } = useGameStore();

  return (
    <>
      {players
        .filter((p) => p.id !== playerId)
        .map((player) => (
          <group
            key={player.id}
            position={[player.position.x, player.position.y, player.position.z]}
          >
            <mesh castShadow>
              <boxGeometry args={[0.5, 1.8, 0.5]} />
              <meshStandardMaterial color={player.color} />
            </mesh>
            <Text
              position={[0, 1.2, 0]}
              fontSize={0.2}
              color="white"
              anchorX="center"
              anchorY="middle"
            >
              {player.nickname}
            </Text>
          </group>
        ))}
    </>
  );
};

export default OtherPlayers;
