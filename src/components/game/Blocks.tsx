import { useGameStore } from '@/lib/gameStore';
import { useBox } from '@react-three/cannon';

const Block = ({ position }: { position: { x: number; y: number; z: number } }) => {
  const [ref] = useBox(() => ({
    type: 'Static',
    position: [position.x, position.y, position.z],
    args: [1, 1, 1],
  }));

  return (
    <mesh ref={ref as any} castShadow>
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial color="#94a3b8" />
    </mesh>
  );
};

const Blocks = () => {
  const { blocks } = useGameStore();

  return (
    <>
      {blocks.map((block) => (
        <Block key={block.id} position={block.position} />
      ))}
    </>
  );
};

export default Blocks;
