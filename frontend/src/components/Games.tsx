// Games.tsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/Games.css";

import noCoverImage from "../assets/Xbox_notFound.svg";

interface GetGameDTO {
  name: string;
  cover?: string | null;
}

const API_BASE = 'http://localhost:8080/api';

function Games() {
  const navigate = useNavigate();
  const [games, setGames] = useState<GetGameDTO[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchGames();
  }, []);

  const fetchGames = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(`${API_BASE}/games`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
      });

      if (response.status === 204) {
        setGames([]);
        return;
      }

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const gamesData: GetGameDTO[] = await response.json();
      setGames(gamesData);
    } catch (err) {
      console.error('Error fetching games:', err);
      setError(err instanceof Error ? err.message : 'Не удалось загрузить список игр');
    } finally {
      setIsLoading(false);
    }
  };

  // Обработчик клика по карточке игры
  const handleGameClick = (gameName: string) => {
    // Перенаправляем на главную страницу с параметром tag
    navigate(`/home?tag=${encodeURIComponent(gameName)}`);
  };

  if (isLoading) {
    return (
      <div className="games-loading">
        <div className="loading-spinner"></div>
        <p>Загрузка игр...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="games-error">
        <div className="error-container">
          <p className="error-message">{error}</p>
          <button onClick={fetchGames} className="retry-button">
            Попробовать снова
          </button>
        </div>
      </div>
    );
  }

  if (games.length === 0) {
    return (
      <div className="games-empty">
        <div className="empty-container">
          <p>Игры пока не добавлены</p>
          <p>Следите за обновлениями!</p>
        </div>
      </div>
    );
  }

  return (
    <div className="games-container">
      <div className="games-header">
        <h1>Игры</h1>
        <p>Коллекция игр, доступных в нашем сообществе</p>
      </div>
      <div className="games-grid">
        {games.map((game, index) => (
          <div
            key={index}
            className="game-card"
            onClick={() => handleGameClick(game.name)}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                handleGameClick(game.name);
              }
            }}
          >
            <div className="game-card-image">
              <img
                src={game.cover || noCoverImage}
                alt={game.name}
                onError={(e) => {
                  (e.target as HTMLImageElement).src = noCoverImage;
                }}
              />
            </div>
            <div className="game-card-content">
              <h3 className="game-name">{game.name}</h3>
              <span className="game-posts-hint">
                                Показать посты
                            </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Games;