import mysql2 from 'mysql2/promise';

class Database_tictactoe {
    constructor() {
        this.db = null;
    }

    async init(config, database) {
        const db = await mysql2.createConnection(config);
        console.log('Initialized database');
        await db.query(`CREATE DATABASE IF NOT EXISTS \`${database}\`;`);
        await db.query(`USE \`${database}\`;`);
        console.log(`Using database ${database}`);
        await db.query(`CREATE TABLE IF NOT EXISTS \`games\` (
            \`id\` int NOT NULL AUTO_INCREMENT,
            \`result\` varchar(10) NOT NULL,
            \`timestamp\` varchar(50) NOT NULL,
            \`moves\` json NOT NULL,
            PRIMARY KEY (\`id\`)
          );`);
        console.log('table exist or was created');
        this.db = db;
    }
    async getGamebyId(id) {
        const [rows] = await this.db.query(`SELECT * FROM games WHERE id = ?;`, [id]);
        if (rows.length === 0) {
            console.log('game not found');
            return null
        };
        return rows[0];
    }

    async allGames() {
        const rows = await this.db.query(`SELECT * FROM games;`);
        return rows[0];
    }

    async InlcudeGame(result, timestamp, moves) {
        const [resultInsert] = await this.db.query(
            `INSERT INTO games (result, timestamp, moves) VALUES (?, ?, ?);`,
            [result, timestamp, JSON.stringify(moves)]
        );
        const insertedId = resultInsert.insertId;
        let res = await this.getGamebyId(insertedId);
        return res != null ? true : false;
    }

    async removeGamebyId(id) {
        let res = await this.db.query(`DELETE FROM games WHERE id = ?;`, [id]);
        return res.affectedRows == 1 ? `Game with id ${id} deleted` : `Game with id ${id} not found`;
    }


    async close() {
        await this.db.end();
        console.log('Database closed');
    }
}

export default Database_tictactoe;