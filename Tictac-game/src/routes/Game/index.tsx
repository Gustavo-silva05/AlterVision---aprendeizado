import axios from 'axios';
import dayjs from 'dayjs';
import { useCallback, useEffect, useState } from 'react';
import style from './Game.module.css';
import { Link, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';

// type/props define um tipo com os possiveis estados para variaveis ou funções vazias
type SquareProps = {
    value: string | null;
    onSquareClick: () => void;
};

type BoardProps = {
    xIsNext: boolean;
    squares: (string | null)[];
    onPlay: (nextSquares: (string | null)[]) => void;
    onNewGame: () => void;
};

function Square({ value, onSquareClick }: SquareProps) {
    return (
        <button className={style.square} onClick={onSquareClick}>
            {value}
        </button>
    );
}

function Board({ xIsNext, squares, onPlay, onNewGame }: BoardProps) {

    function handleClick(i: number) {
        if (calculateWinner(squares) || squares[i] || isDraw(squares)) {
            return;
        }
        const nextSquares = squares.slice();
        nextSquares[i] = xIsNext ? 'X' : 'O';
        onPlay(nextSquares);
    }

    const winner = calculateWinner(squares);
    let status: string;
    if (winner) {
        status = 'Winner: ' + winner;
    } else if (isDraw(squares)) {
        status = 'Draw';
    } else {
        status = 'Next player: ' + (xIsNext ? 'X' : 'O');
    }

    return (
        <>
            <div className={style.status}>{status}</div>
            <div className={style.boardRow}>
                <Square value={squares[0]} onSquareClick={() => handleClick(0)} />
                <Square value={squares[1]} onSquareClick={() => handleClick(1)} />
                <Square value={squares[2]} onSquareClick={() => handleClick(2)} />
            </div>
            <div className={style.boardRow}>
                <Square value={squares[3]} onSquareClick={() => handleClick(3)} />
                <Square value={squares[4]} onSquareClick={() => handleClick(4)} />
                <Square value={squares[5]} onSquareClick={() => handleClick(5)} />
            </div>
            <div className={style.boardRow}>
                <Square value={squares[6]} onSquareClick={() => handleClick(6)} />
                <Square value={squares[7]} onSquareClick={() => handleClick(7)} />
                <Square value={squares[8]} onSquareClick={() => handleClick(8)} />
            </div>
            {(winner || isDraw(squares)) && (
                <Link to={'/Game'}>
                    <button className={style.buttonNewGame} onClick={onNewGame}>
                        New Game
                    </button>
                </Link>
            )}
        </>
    );
}

type GameRecord = {
    result: string;
    timestamp: string;
    moves: (string | null)[][];
};

type Game = {
    id: number;
    result: string;
    timestamp: string;
    moves: {
        squares: (string | null)[][];
    };
};


export default function Game() {
    const { id } = useParams<{ id?: (string) }>();
    const [history, setHistory] = useState<(string | null)[][]>([Array(9).fill(null)]);
    const [currentMove, setCurrentMove] = useState(0);
    const xIsNext = currentMove % 2 === 0;
    const currentSquares = history[currentMove];


    const fetchGames = useCallback(async (id: string) => {
        try {
            const res = await axios.get(`http://localhost:3001/games/${id}`);
            const game: Game = {
                id: res.data.id,
                result: res.data.result,
                timestamp: res.data.timestamp,
                moves: res.data.moves
            };
            setHistory(game.moves.squares);
            jumpTo(game.moves.squares.length - 1);
        } catch (error) {
            console.error(`Failed to fetch game(${id.slice(1)}):`, error);
        }
    }, [setHistory]);

    useEffect(() => {
        if (id) {
            fetchGames(id);
        }
    }, [id, fetchGames]);

    async function saveGameToBackend(gameRecord: GameRecord) {
        try {
            await axios.post('http://localhost:3001/games/post', {
                result: gameRecord.result,
                timestamp: gameRecord.timestamp,
                moves: {
                    squares: gameRecord.moves
                },
            });
        } catch (err) {
            console.error('Failed to save game:', err);
        }
    }

    function saveGameIfOver(boxes: (string | null)[]) {
        const winner = calculateWinner(boxes);
        if (winner || isDraw(boxes)) {
            const gameRecord: GameRecord = {
                result: winner ? `${winner}` : 'Draw',
                moves: [...history, boxes],
                timestamp: dayjs().format('DD/MM/YYYY HH:mm:ss'),
            };
            saveGameToBackend(gameRecord);
        }
    }

    function handleNewGame() {
        setHistory([Array(9).fill(null)]);
        setCurrentMove(0);
    }

    function handlePlay(nextSquares: (string | null)[]) {
        const nextHistory = [...history.slice(0, currentMove + 1), nextSquares];
        setHistory(nextHistory);
        setCurrentMove(nextHistory.length - 1);
        saveGameIfOver(nextSquares);
    }

    function jumpTo(nextMove: number) {
        setCurrentMove(nextMove);
    }



    const moves = history.map((_, move) => {
        const description = move > 0 ? 'Go to move #' + move : 'Go to game start';
        return (
            <li key={move}>
                <button className={style.buttonHistory} onClick={() => jumpTo(move)}>
                    {description}
                </button>
            </li>
        );
    });

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
        >

            <header className={style.header}>
                <Link to="/"><button>Home</button></Link>
                <Link to="/History"><button>History</button></Link>
            </header>
            <div className={style.game}>
                <div className={style.gameBoard}>
                    <Board
                        xIsNext={xIsNext}
                        squares={currentSquares}
                        onPlay={handlePlay}
                        onNewGame={handleNewGame}
                    />
                </div>
                <div className={style.gameInfo}>
                    <ol>{moves}</ol>
                </div>
            </div>
        </motion.div>
    );
}

function calculateWinner(squares: (string | null)[]): string | null {
    const lines = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6],
    ];
    for (const [a, b, c] of lines) {
        if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
            return squares[a];
        }
    }
    return null;
}

function isDraw(squares: (string | null)[]) {
    return squares.every(Boolean) && !calculateWinner(squares);
}
