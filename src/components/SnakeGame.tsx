import React, { useState, useEffect, useCallback, useRef } from 'react';

// Grid size
const GRID_SIZE = 20;

type Point = { x: number; y: number };

const INITIAL_SNAKE = [
  { x: 10, y: 10 },
  { x: 10, y: 11 },
  { x: 10, y: 12 },
];
const INITIAL_DIRECTION = { x: 0, y: -1 }; // Moving UP

const generateFood = (snake: Point[]): Point => {
  let newFood: Point;
  let isOccupied = true;
  while (isOccupied) {
    newFood = {
      x: Math.floor(Math.random() * GRID_SIZE),
      y: Math.floor(Math.random() * GRID_SIZE),
    };
    isOccupied = snake.some((segment) => segment.x === newFood.x && segment.y === newFood.y);
  }
  return newFood!;
};

export default function SnakeGame() {
  const [snake, setSnake] = useState<Point[]>(INITIAL_SNAKE);
  const [food, setFood] = useState<Point>({ x: 5, y: 5 });
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [isPaused, setIsPaused] = useState(false);

  // Manage inputs with a queue to ensure rapid keystrokes are executed in order
  const directionQueueRef = useRef<Point[]>([]);
  const currentDirectionRef = useRef<Point>(INITIAL_DIRECTION);

  // Use a ref for food so functional state updates can access it without adding to dependencies
  const foodRef = useRef(food);
  useEffect(() => {
    foodRef.current = food;
  }, [food]);

  useEffect(() => {
    // initialize food that is not on snake
    setFood(generateFood(INITIAL_SNAKE));
  }, []);

  const resetGame = () => {
    setSnake(INITIAL_SNAKE);
    directionQueueRef.current = [];
    currentDirectionRef.current = INITIAL_DIRECTION;
    setScore(0);
    setGameOver(false);
    setIsPaused(false);
    setFood(generateFood(INITIAL_SNAKE));
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Prevent scrolling when playing with arrow keys or space
      if (["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight", "w", "a", "s", "d", " "].includes(e.key)) {
        e.preventDefault();
      }

      if (e.key === ' ' && !gameOver) {
        setIsPaused(p => !p);
        return;
      }

      if (gameOver || isPaused) return;

      const currStateDir = directionQueueRef.current.length > 0 
        ? directionQueueRef.current[directionQueueRef.current.length - 1] 
        : currentDirectionRef.current;

      let newDir: Point | null = null;
      switch (e.key) {
        case 'ArrowUp':
        case 'w':
          if (currStateDir.y !== 1) newDir = { x: 0, y: -1 };
          break;
        case 'ArrowDown':
        case 's':
          if (currStateDir.y !== -1) newDir = { x: 0, y: 1 };
          break;
        case 'ArrowLeft':
        case 'a':
          if (currStateDir.x !== 1) newDir = { x: -1, y: 0 };
          break;
        case 'ArrowRight':
        case 'd':
          if (currStateDir.x !== -1) newDir = { x: 1, y: 0 };
          break;
      }

      if (newDir && directionQueueRef.current.length < 3) {
        directionQueueRef.current.push(newDir);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [gameOver, isPaused]);

  useEffect(() => {
    if (gameOver || isPaused) return;

    const moveSnake = () => {
      setSnake((prevSnake) => {
        let nextDirection = currentDirectionRef.current;
        if (directionQueueRef.current.length > 0) {
          nextDirection = directionQueueRef.current.shift()!;
          currentDirectionRef.current = nextDirection;
        }

        const head = prevSnake[0];
        const newHead = {
          x: head.x + nextDirection.x,
          y: head.y + nextDirection.y,
        };

        // Check Wall Collision
        if (
          newHead.x < 0 ||
          newHead.x >= GRID_SIZE ||
          newHead.y < 0 ||
          newHead.y >= GRID_SIZE
        ) {
          setGameOver(true);
          return prevSnake;
        }

        // Check Self Collision
        if (prevSnake.some((segment) => segment.x === newHead.x && segment.y === newHead.y)) {
          setGameOver(true);
          return prevSnake;
        }

        const newSnake = [newHead, ...prevSnake];

        // Check Food Collision
        if (newHead.x === foodRef.current.x && newHead.y === foodRef.current.y) {
          setScore((s) => s + 10);
          setFood(generateFood(newSnake));
        } else {
          newSnake.pop(); // remove tail if no food eaten
        }

        return newSnake;
      });
    };

    const speed = Math.max(60, 110 - Math.floor(score / 50) * 10); // Smoother and slightly faster
    const gameLoop = setInterval(moveSnake, speed);
    return () => clearInterval(gameLoop);
  }, [gameOver, isPaused, score]);

  return (
    <div className="flex flex-col items-center gap-6">
      <div className="flex justify-between items-end w-full max-w-[400px]">
        <div>
          <h1 className="text-3xl font-bold font-sans tracking-tight text-glow-cyan uppercase">Snake</h1>
          <p className="text-xs text-gray-400 uppercase tracking-widest mt-1">Grid Alpha</p>
        </div>
        <div className="text-right">
          <p className="text-[10px] text-neon-pink uppercase tracking-[0.2em] mb-1">Score</p>
          <p className="font-mono text-3xl font-bold text-white text-shadow-sm">{score.toString().padStart(4, '0')}</p>
        </div>
      </div>

      <div className="relative glass-panel p-2 rounded-xl">
        <div 
          className="bg-black/60 border border-gray-800 rounded-lg overflow-hidden relative"
          style={{
            display: 'grid',
            gridTemplateColumns: `repeat(${GRID_SIZE}, minmax(0, 1fr))`,
            width: '400px',
            height: '400px',
          }}
        >
          {Array.from({ length: GRID_SIZE * GRID_SIZE }).map((_, index) => {
            const x = index % GRID_SIZE;
            const y = Math.floor(index / GRID_SIZE);
            
            const isSnakeHead = snake[0].x === x && snake[0].y === y;
            const isSnakeBody = snake.some((seg, idx) => idx !== 0 && seg.x === x && seg.y === y);
            const isFood = food.x === x && food.y === y;

            let cellClasses = "w-full h-full border border-white/[0.02] ";
            if (isSnakeHead) {
              cellClasses += "bg-neon-cyan box-glow-cyan z-10 rounded-[2px]";
            } else if (isSnakeBody) {
              cellClasses += "bg-neon-cyan/70 shadow-[0_0_5px_rgba(0,243,255,0.5)] rounded-[2px]";
            } else if (isFood) {
              cellClasses += "bg-neon-green box-glow-green rounded-full animate-pulse";
            }

            return <div key={`${x}-${y}`} className={cellClasses} />;
          })}
          
          {/* Grid lines (Subtle) */}
          <div className="absolute inset-0 pointer-events-none" 
            style={{
              backgroundImage: 'linear-gradient(to right, rgba(255,255,255,0.02) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.02) 1px, transparent 1px)',
              backgroundSize: `${400/GRID_SIZE}px ${400/GRID_SIZE}px`
            }} 
          />
        </div>

        {gameOver && (
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm flex flex-col items-center justify-center rounded-xl z-20">
            <h2 className="text-4xl font-bold font-sans text-glow-pink text-neon-pink uppercase mb-2">System Failure</h2>
            <p className="font-mono text-gray-300 mb-6">Final Score: {score}</p>
            <button 
              onClick={resetGame}
              className="px-6 py-2 border border-neon-cyan text-neon-cyan font-mono uppercase tracking-widest hover:bg-neon-cyan hover:text-black transition-colors rounded"
            >
              Restart
            </button>
          </div>
        )}

        {isPaused && !gameOver && (
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm flex flex-col items-center justify-center rounded-xl z-20">
             <h2 className="text-2xl tracking-[0.3em] font-sans text-white uppercase animate-pulse">Paused</h2>
          </div>
        )}
      </div>

      <p className="text-xs text-gray-500 font-mono tracking-widest">USE WASD OR ARROWS // SPACE TO PAUSE</p>
    </div>
  );
}
