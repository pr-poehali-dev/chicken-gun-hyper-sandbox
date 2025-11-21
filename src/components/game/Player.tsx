import { useRef, useEffect } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { useSphere } from '@react-three/cannon';
import { Vector3 } from 'three';
import { useGameStore } from '@/lib/gameStore';

const SPEED = 5;
const JUMP_FORCE = 5;

interface PlayerProps {
  mobileInput?: { x: number; y: number };
}

const Player = ({ mobileInput }: PlayerProps) => {
  const { playerId, gameServerUrl, nickname } = useGameStore();
  const { camera } = useThree();
  
  const [ref, api] = useSphere(() => ({
    mass: 1,
    type: 'Dynamic',
    position: [0, 2, 0],
    args: [0.5],
  }));

  const velocity = useRef([0, 0, 0]);
  const position = useRef([0, 2, 0]);

  useEffect(() => {
    const unsubscribeVel = api.velocity.subscribe((v) => (velocity.current = v));
    const unsubscribePos = api.position.subscribe((p) => (position.current = p));
    return () => {
      unsubscribeVel();
      unsubscribePos();
    };
  }, [api]);

  const keys = useRef({
    forward: false,
    backward: false,
    left: false,
    right: false,
    jump: false,
    shoot: false,
    build: false,
  });

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const key = e.key.toLowerCase();
      if (key === 'w') keys.current.forward = true;
      if (key === 's') keys.current.backward = true;
      if (key === 'a') keys.current.left = true;
      if (key === 'd') keys.current.right = true;
      if (key === 'b') keys.current.build = true;
      if (key === ' ') {
        keys.current.jump = true;
        e.preventDefault();
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      const key = e.key.toLowerCase();
      if (key === 'w') keys.current.forward = false;
      if (key === 's') keys.current.backward = false;
      if (key === 'a') keys.current.left = false;
      if (key === 'd') keys.current.right = false;
      if (key === 'b') keys.current.build = false;
      if (key === ' ') keys.current.jump = false;
    };

    const handleMouseDown = (e: MouseEvent) => {
      if (e.button === 0) {
        keys.current.shoot = true;
      }
    };

    const handleMouseUp = (e: MouseEvent) => {
      if (e.button === 0) {
        keys.current.shoot = false;
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('keyup', handleKeyUp);
    document.addEventListener('mousedown', handleMouseDown);
    document.addEventListener('mouseup', handleMouseUp);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('keyup', handleKeyUp);
      document.removeEventListener('mousedown', handleMouseDown);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, []);

  useFrame(() => {
    camera.position.set(position.current[0], position.current[1] + 0.5, position.current[2]);

    const direction = new Vector3();
    camera.getWorldDirection(direction);
    direction.y = 0;
    direction.normalize();

    const right = new Vector3();
    right.crossVectors(camera.up, direction).normalize();

    const movement = new Vector3();

    if (keys.current.forward) movement.add(direction);
    if (keys.current.backward) movement.sub(direction);
    if (keys.current.left) movement.add(right);
    if (keys.current.right) movement.sub(right);

    if (mobileInput && (mobileInput.x !== 0 || mobileInput.y !== 0)) {
      const mobileMovement = direction.clone().multiplyScalar(mobileInput.y);
      const mobileStrafe = right.clone().multiplyScalar(-mobileInput.x);
      movement.add(mobileMovement).add(mobileStrafe);
    }

    if (movement.length() > 0) {
      movement.normalize().multiplyScalar(SPEED);
    }

    api.velocity.set(movement.x, velocity.current[1], movement.z);

    if (keys.current.jump && Math.abs(velocity.current[1]) < 0.1) {
      api.velocity.set(velocity.current[0], JUMP_FORCE, velocity.current[2]);
    }

    if (playerId && nickname) {
      fetch(gameServerUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'update',
          playerId,
          position: {
            x: position.current[0],
            y: position.current[1],
            z: position.current[2],
          },
          rotation: camera.rotation.y,
          is_shooting: keys.current.shoot,
        }),
      }).catch(() => {});
    }

    if (keys.current.shoot) {
      keys.current.shoot = false;
      
      const bulletDirection = new Vector3();
      camera.getWorldDirection(bulletDirection);
      
      fetch(gameServerUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'shoot',
          playerId,
          position: {
            x: position.current[0],
            y: position.current[1] + 0.5,
            z: position.current[2],
          },
          direction: {
            x: bulletDirection.x,
            y: bulletDirection.y,
            z: bulletDirection.z,
          },
        }),
      }).catch(() => {});
    }

    if (keys.current.build) {
      keys.current.build = false;
      
      const buildDirection = new Vector3();
      camera.getWorldDirection(buildDirection);
      buildDirection.multiplyScalar(2);
      
      const buildPos = {
        x: Math.floor(position.current[0] + buildDirection.x),
        y: Math.floor(position.current[1]),
        z: Math.floor(position.current[2] + buildDirection.z),
      };
      
      fetch(gameServerUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'place_block',
          playerId,
          position: buildPos,
          blockType: 'cube',
        }),
      }).catch(() => {});
    }
  });

  return <mesh ref={ref as any} />;
};

export default Player;