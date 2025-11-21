import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useGameStore } from '@/lib/gameStore';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const LoginScreen = () => {
  const [nickname, setNickname] = useState('');
  const [loading, setLoading] = useState(false);
  const { setPlayerId, setNickname: setStoreNickname, setConnected, gameServerUrl } = useGameStore();

  const colors = [
    '#ef4444', '#f59e0b', '#10b981', '#3b82f6', 
    '#8b5cf6', '#ec4899', '#14b8a6', '#f97316'
  ];

  const handleJoin = async () => {
    if (!nickname.trim()) return;

    setLoading(true);
    
    try {
      const playerId = `player_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      const color = colors[Math.floor(Math.random() * colors.length)];

      const response = await fetch(gameServerUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'join',
          playerId,
          nickname: nickname.trim(),
          color,
        }),
      });

      if (response.ok) {
        setPlayerId(playerId);
        setStoreNickname(nickname.trim());
        setConnected(true);
      } else {
        alert('Ошибка подключения к серверу');
      }
    } catch (error) {
      console.error('Failed to join game:', error);
      alert('Не удалось подключиться к игре');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500">
      <Card className="w-full max-w-md mx-4">
        <CardHeader className="text-center">
          <CardTitle className="text-4xl font-bold">🎮 Low-Poly Battle</CardTitle>
          <CardDescription className="text-lg">
            Мультиплеер экшен-игра
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Введите ваш никнейм</label>
            <Input
              type="text"
              placeholder="Ваш никнейм..."
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleJoin()}
              maxLength={20}
              className="text-lg"
            />
          </div>
          
          <Button 
            onClick={handleJoin} 
            disabled={!nickname.trim() || loading}
            className="w-full text-lg h-12"
          >
            {loading ? 'Подключение...' : 'Войти в игру'}
          </Button>

          <div className="bg-muted p-4 rounded-lg space-y-2 text-sm">
            <p className="font-semibold">Управление:</p>
            <p>🎯 WASD - перемещение</p>
            <p>⬆️ Пробел - прыжок</p>
            <p>🔫 ЛКМ - стрелять</p>
            <p>🏗️ B - построить блок</p>
            <p>📱 Поддержка мобильных устройств</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default LoginScreen;
