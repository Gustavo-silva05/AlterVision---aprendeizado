import express from 'express';
import cors from 'cors';
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat.js' 
dayjs.extend(customParseFormat);
import Database_tictactoe from './database/index.js';

const app = express();
const port = 3001; 

app.use(cors());
app.use(express.json());

const dbConfig = {
    host: "127.0.0.1",
    port: 3306,
    user: "root",
    password: "rootpwd",
};
const databaseName = 'tictactoe';

const database = new Database_tictactoe();
await database.init(dbConfig, databaseName);

app.get('/games', async (req, res) => {
    const games = await database.allGames();
    if (games.length === 0) {
        res.status(200).json({ message: 'No games found' });
    }
    else{
        res.json(games);
    }
});

app.get('/games/:id', async (req, res) => {
    const id = req.params.id;
    const game = await database.getGamebyId(id);
    if (game) {
        res.json(game);
    } else {
        res.status(404).json({ message: 'Game with id ' + id + ' not found' });
    }
});


async function is_valid_timestamp(timestamp) {
    const regex = /^\d{2}\/\d{2}\/\d{4} \d{2}:\d{2}:\d{2}$/;
    return regex.test(timestamp) && timestamp.length === 19 && dayjs(timestamp, "DD/MM/YYYY HH:mm:ss", true).isValid();
}


app.post('/games/post', async (req, res) => {
    const { result, timestamp, moves } = req.body;
    if (!result || !timestamp || !moves) {
        return res.status(400).json({ message: 'Missing required fields' });
    }
    if (result != 'X' && result != 'O' && result != 'Draw') {
        return res.status(400).json({ message: 'Invalid result' });
    }
    if ( !await is_valid_timestamp(timestamp)) {
        return res.status(400).json({ message: 'timestamp wrong format or not valid, correct (DD/MM/YYYY HH:MM:SS)' });
    }
    if (!moves.squares) {
        return res.status(400).json({ message: 'Missing squares' });
    }
    await database.InlcudeGame(result, timestamp, moves);
    res.json({ message: 'Game saved successfully' });
});

app.delete('/games/delete/:id', async (req, res) => {
    let id = req.params.id;
    if(!id){
        return res.status(400).json({ message: 'Missing id' });
    }
    id = Number(id);
    const games = await database.allGames();
    if (id < 0 || id > games[games.length - 1].id) {
        return res.status(404).json({ message: 'Game with id ' + id + ' can not be found' }); 
    }
    const success = await database.removeGamebyId(id);
    res.json({ message: success });
});

process.on('SIGINT', async () => {
    await database.close();
    process.exit();
});

app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});
