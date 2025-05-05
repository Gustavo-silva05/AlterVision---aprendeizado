import { Link } from 'react-router-dom'
import style from './Home.module.css'
import axios from 'axios'


const Home = () => {

    async function reset() {
        const confirm = window.confirm('Are you sure you want to delete all games?');
        if (!confirm) return;
    
        try {
            const response = await axios.get('http://localhost:3001/games');
            const games = response.data;
    
            for(const game of games) {
                await axios.delete(`http://localhost:3001/games/delete/${game.id}`);
            }
    
            alert('All games have been deleted!');
        } catch (error) {
            console.error('Failed to reset games:', error);
            alert('Error deleting games.');
        }
    }


    return (
        <div className={style.container}>
            <div className={style.title}>
                <h1>Welcome to Tic-Tac-Toe</h1>
                <p>Created by Gustavo</p>
            </div>

            <div className={style.buttons}>
                <Link to="/Game" className={style.link}>
                    <button className={style.btn}>Play</button>
                </Link>
                <Link to="/History" className={style.link}>
                    <button className={style.btn}>History</button>
                </Link>

                <button onClick={reset}  className={style.btn}>Reset</button>
            </div>
        </div>
    );
}

export default Home;
