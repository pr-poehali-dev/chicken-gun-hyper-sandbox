import { useGameStore } from '@/lib/gameStore';
import { Button } from '@/components/ui/button';

const UI = () => {
  const { players, playerId, nickname } = useGameStore();
  
  const currentPlayer = players.find(p => p.id === playerId);

  return (
    <div className="fixed inset-0 pointer-events-none">
      <div className="absolute top-4 left-4 bg-black/70 text-white p-4 rounded-lg backdrop-blur-sm pointer-events-auto">
        <h3 className="font-bold mb-2">{nickname}</h3>
        <p className="text-sm">HP: {currentPlayer?.health || 100}</p>
        <p className="text-sm">Игроков онлайн: {players.length}</p>
      </div>

      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black/70 text-white px-4 py-2 rounded-lg backdrop-blur-sm">
        <p className="text-sm">WASD - движение | Пробел - прыжок | ЛКМ - стрелять | B - строить</p>
      </div>

      <div className="absolute top-4 right-4 bg-black/70 text-white p-4 rounded-lg backdrop-blur-sm pointer-events-auto max-h-60 overflow-y-auto">
        <h3 className="font-bold mb-2">Игроки:</h3>
        {players.map((player) => (
          <div key={player.id} className="text-sm mb-1 flex items-center gap-2">
            <div 
              className="w-3 h-3 rounded-full" 
              style={{ backgroundColor: player.color }}
            />
            {player.nickname}
          </div>
        ))}
      </div>

      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
        <div className="w-1 h-6 bg-white absolute left-1/2 transform -translate-x-1/2 -translate-y-3"></div>
        <div className="w-6 h-1 bg-white absolute top-1/2 transform -translate-y-1/2 -translate-x-3"></div>
      </div>
    </div>
  );
};

export default UI;
