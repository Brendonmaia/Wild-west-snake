import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [snake, setSnake] = useState([
    { x: 10, y: 10 },
    { x: 10, y: 11 },
  ]);
  const [food, setFood] = useState({ x: 5, y: 5 });
  const [direction, setDirection] = useState('UP');
  const [gameOver, setGameOver] = useState(false);
  const [highScore, setHighScore] = useState(0);

  const currentScore = snake.length - 2;

  useEffect(() => {
    const savedHighScore = localStorage.getItem('snakeHighScore');
    if (savedHighScore) {
      setHighScore(parseInt(savedHighScore, 10));
    }
  }, []);

  useEffect(() => {
    if (currentScore > highScore) {
      setHighScore(currentScore);
      localStorage.setItem('snakeHighScore', currentScore.toString());
    }
  }, [currentScore, highScore]);

  const generateFood = () => {
    const x = Math.floor(Math.random() * 18) + 1;
    const y = Math.floor(Math.random() * 18) + 1;
    return { x, y };
  };

  useEffect(() => {
    const handleKeyPress = (e) => {
      switch (e.key) {
        case 'ArrowUp':
          if (direction !== 'DOWN') setDirection('UP');
          break;
        case 'ArrowDown':
          if (direction !== 'UP') setDirection('DOWN');
          break;
        case 'ArrowLeft':
          if (direction !== 'RIGHT') setDirection('LEFT');
          break;
        case 'ArrowRight':
          if (direction !== 'LEFT') setDirection('RIGHT');
          break;
        default:
          break;
      }
    };
    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [direction]);

  useEffect(() => {
    if (gameOver) return;

    const speed = Math.max(60, 150 - currentScore * 4);

    const interval = setInterval(() => {
      setSnake((prevSnake) => {
        const head = { ...prevSnake[0] };

        if (direction === 'UP') head.y -= 1;
        if (direction === 'DOWN') head.y += 1;
        if (direction === 'LEFT') head.x -= 1;
        if (direction === 'RIGHT') head.x += 1;

        if (head.x < 0 || head.x >= 20 || head.y < 0 || head.y >= 20) {
          setGameOver(true);
          return prevSnake;
        }

        for (let i = 0; i < prevSnake.length; i++) {
          if (head.x === prevSnake[i].x && head.y === prevSnake[i].y) {
            setGameOver(true);
            return prevSnake;
          }
        }

        const newSnake = [head, ...prevSnake];
        if (head.x === food.x && head.y === food.y) {
          setFood(generateFood());
        } else {
          newSnake.pop();
        }

        return newSnake;
      });
    }, speed);

    return () => clearInterval(interval);
  }, [direction, food, gameOver, currentScore]);

  const restartGame = () => {
    setSnake([
      { x: 10, y: 10 },
      { x: 10, y: 11 },
    ]);
    setFood(generateFood());
    setDirection('UP');
    setGameOver(false);
  };

  return (
    <div className="western-scene">
      {/* --- Elementos de Fora (Moinho, Cactos e Cercas de Madeira Reais) --- */}
      <div className="outside-decorations">
        {/* Moinho no topo central */}
        <div className="outer-windmill">
          <div className="windmill-tower"></div>
          <div className="windmill-blades"></div>
        </div>

        {/* Cactos nas laterais */}
        <div className="outer-cactus cactus-left">🌵</div>
        <div className="outer-cactus cactus-right">🌵</div>

        {/* Cercas de madeira horizontais nas laterais e base */}
        <div className="wooden-fence fence-left">
          <div className="rail rail-top"></div>
          <div className="rail rail-bottom"></div>
          <div className="post"></div>
          <div className="post" style={{ top: '65px' }}></div>
          <div className="post" style={{ top: '130px' }}></div>
          <div className="post" style={{ top: '195px' }}></div>
        </div>

        <div className="wooden-fence fence-right">
          <div className="rail rail-top"></div>
          <div className="rail rail-bottom"></div>
          <div className="post"></div>
          <div className="post" style={{ top: '65px' }}></div>
          <div className="post" style={{ top: '130px' }}></div>
          <div className="post" style={{ top: '195px' }}></div>
        </div>

        <div className="wooden-fence fence-bottom">
          <div className="rail-h rail-h-top"></div>
          <div className="rail-h rail-h-bottom"></div>
          <div className="post-v" style={{ left: '15px' }}></div>
          <div className="post-v" style={{ left: '110px' }}></div>
          <div className="post-v" style={{ left: '210px' }}></div>
          <div className="post-v" style={{ left: '310px' }}></div>
          <div className="post-v" style={{ left: '410px' }}></div>
        </div>
      </div>

      {/* --- Caixa Principal do Jogo --- */}
      <div className="game-container">
        <div className="header">
          <h1><span>🤠</span> Wild West Snake</h1>
        </div>
        
        <div className="score-board">
          <div className="score-item">Pontuação: <span>{currentScore}</span></div>
          <div className="score-item">Recorde: <span>{highScore}</span></div>
        </div>
        
        <div className="board">
          <div
            className="food"
            style={{ gridColumnStart: food.x + 1, gridRowStart: food.y + 1 }}
          />

          {snake.map((segment, index) => {
            const isHead = index === 0;
            return (
              <div
                key={index}
                className={isHead ? 'snake-head' : 'snake-segment'}
                style={{ gridColumnStart: segment.x + 1, gridRowStart: segment.y + 1 }}
              >
                {isHead && (
                  <>
                    <div className="cowboy-hat"></div>
                    <div className={`snake-tongue ${direction.toLowerCase()}`}></div>
                  </>
                )}
              </div>
            );
          })}

          {gameOver && (
            <div className="game-over-overlay">
              <div className="game-over-box">
                <h2>GAME OVER</h2>
                <button className="restart-btn" onClick={restartGame}>
                  JOGAR NOVAMENTE
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;