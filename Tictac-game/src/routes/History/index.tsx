import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import style from './History.module.css';
import { motion } from 'framer-motion';

type Game = {
    id: number;
    result: string;
    timestamp: string;
    moves: {
        squares: (string | null)[][];
    };
};

export default function History() {
    const [games, setGames] = useState<Game[]>([]);

    useEffect(() => {
        async function fetchGames() {
            try {
                const response = await axios.get<Game[]>('http://localhost:3001/games');
                setGames(response.data);
            } catch (error) {
                console.error('Failed to fetch games:', error);
            }
        }

        fetchGames();
    }, []);


    // Função para renderizar o tabuleiro final
    const renderBoard = (squares: (string | null)[]) => {
        return (
            <div className={style.boardGrid}>
                {squares.map((square, index) =>
                    <div key={index} className={style.square}>
                        {square ? square : '@'}
                    </div>


                )}
            </div>
        );
    };

    return (
        <motion.div className={style.container}
            initial={{ x: 300, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -300, opacity: 0 }}
            transition={{ duration: 0.5 }}

        >
            <div className={style.title}>
                <h1>Game History</h1>
                <p>List of all completed games</p>
            </div>

            <div className={style.buttons}>
                <Link to="/" className={style.link}>
                    <button className={style.btn}>Home</button>
                </Link>
                <Link to="/Game" className={style.link}>
                    <button className={style.btn}>Play</button>
                </Link>
            </div>
            <div>
                {!games.length ? (
                    <p className={style.emptyMsg}>No games recorded yet.</p>
                ) : (
                    games.map((game) => (
                        <div key={game.id} className={style.gameCard}>
                            <p><strong>Result:</strong> {game.result}</p>
                            <p><strong>Timestamp:</strong> {game.timestamp}</p>
                            <details className={style.details}>
                                <summary>Show final board</summary>
                                {renderBoard(game.moves.squares[game.moves.squares.length - 1])}
                            </details>
                            <Link to={`/Game/${game.id}`}>
                                <button className={style.gameBtn}>See game</button>
                            </Link>
                        </div>
                    ))
                )}
            </div>
        </motion.div>
    );
}
