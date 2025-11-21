import { useEffect, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { useGameStore } from '@/lib/gameStore';
import * as THREE from 'three';

interface BulletProps {
  position: { x: number; y: number; z: number };
  direction: { x: number; y: number; z: number };
}

const Bullet = ({ position, direction }: BulletProps) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const velocity = useRef(new THREE.Vector3(direction.x, direction.y, direction.z).multiplyScalar(20));

  useFrame(() => {
    if (meshRef.current) {
      meshRef.current.position.add(velocity.current.clone().multiplyScalar(0.016));
    }
  });

  return (
    <mesh ref={meshRef} position={[position.x, position.y, position.z]}>
      <sphereGeometry args={[0.1, 8, 8]} />
      <meshBasicMaterial color="#ffff00" />
    </mesh>
  );
};

const Bullets = () => {
  const { bullets } = useGameStore();

  return (
    <>
      {bullets.map((bullet) => (
        <Bullet
          key={bullet.id}
          position={bullet.position}
          direction={bullet.direction}
        />
      ))}
    </>
  );
};

export default Bullets;
