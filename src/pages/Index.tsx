import { useGameStore } from '@/lib/gameStore';
import LoginScreen from '@/components/LoginScreen';
import Game from '@/components/Game';

const Index = () => {
  const { connected } = useGameStore();

  return (
    <div className="w-full h-screen">
      {!connected ? <LoginScreen /> : <Game />}
    </div>
  );
};

export default Index;