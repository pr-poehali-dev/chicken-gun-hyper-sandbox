import { useBox } from '@react-three/cannon';

const TerrainBlock = ({ position, color }: { position: [number, number, number]; color: string }) => {
  const [ref] = useBox(() => ({
    type: 'Static',
    position,
    args: [1, 1, 1],
  }));

  return (
    <mesh ref={ref as any} castShadow receiveShadow>
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial color={color} />
    </mesh>
  );
};

const Terrain = () => {
  const blocks: Array<{ pos: [number, number, number]; color: string }> = [];

  for (let x = -5; x <= 5; x += 2) {
    for (let z = -5; z <= 5; z += 2) {
      blocks.push({ pos: [x, 0.5, z], color: '#94a3b8' });
    }
  }

  blocks.push({ pos: [3, 1.5, 3], color: '#64748b' });
  blocks.push({ pos: [-3, 1.5, -3], color: '#64748b' });
  blocks.push({ pos: [0, 1.5, 5], color: '#64748b' });

  return (
    <>
      {blocks.map((block, i) => (
        <TerrainBlock key={i} position={block.pos} color={block.color} />
      ))}
    </>
  );
};

export default Terrain;
