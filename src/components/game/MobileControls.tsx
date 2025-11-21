import { useEffect, useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';

interface MobileControlsProps {
  onMove: (direction: { x: number; y: number }) => void;
  onJump: () => void;
  onShoot: () => void;
  onBuild: () => void;
}

const MobileControls = ({ onMove, onJump, onShoot, onBuild }: MobileControlsProps) => {
  const [isMobile, setIsMobile] = useState(false);
  const joystickRef = useRef<HTMLDivElement>(null);
  const touchStartPos = useRef({ x: 0, y: 0 });
  const [joystickPos, setJoystickPos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent));
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const handleTouchStart = (e: React.TouchEvent) => {
    const touch = e.touches[0];
    touchStartPos.current = { x: touch.clientX, y: touch.clientY };
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    const touch = e.touches[0];
    const deltaX = touch.clientX - touchStartPos.current.x;
    const deltaY = touch.clientY - touchStartPos.current.y;
    
    const maxDistance = 50;
    const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
    const clampedDistance = Math.min(distance, maxDistance);
    
    const angle = Math.atan2(deltaY, deltaX);
    const x = Math.cos(angle) * clampedDistance;
    const y = Math.sin(angle) * clampedDistance;
    
    setJoystickPos({ x, y });
    
    onMove({
      x: x / maxDistance,
      y: -y / maxDistance,
    });
  };

  const handleTouchEnd = () => {
    setJoystickPos({ x: 0, y: 0 });
    onMove({ x: 0, y: 0 });
  };

  if (!isMobile) return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-50">
      <div className="absolute bottom-20 left-8 pointer-events-auto">
        <div 
          ref={joystickRef}
          className="relative w-32 h-32 bg-black/30 rounded-full border-2 border-white/50"
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          <div 
            className="absolute w-12 h-12 bg-white/80 rounded-full top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 transition-transform"
            style={{
              transform: `translate(calc(-50% + ${joystickPos.x}px), calc(-50% + ${joystickPos.y}px))`,
            }}
          />
        </div>
      </div>

      <div className="absolute bottom-20 right-8 flex flex-col gap-4 pointer-events-auto">
        <Button
          size="lg"
          className="w-16 h-16 rounded-full"
          onTouchStart={onShoot}
        >
          <Icon name="Target" size={24} />
        </Button>
        <Button
          size="lg"
          className="w-16 h-16 rounded-full"
          onTouchStart={onJump}
        >
          <Icon name="ArrowUp" size={24} />
        </Button>
        <Button
          size="lg"
          className="w-16 h-16 rounded-full"
          onTouchStart={onBuild}
        >
          <Icon name="Box" size={24} />
        </Button>
      </div>
    </div>
  );
};

export default MobileControls;
