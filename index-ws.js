import express from 'express';
import http from 'http';
import { WebSocketServer } from 'ws';
import path from 'path';
import { fileURLToPath } from 'url';
import sqlite3 from 'sqlite3';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const server = http.createServer(app);

app.get('/', (req, res) => {
	res.sendFile('index.html', { root: __dirname });
});

server.listen(3001, () => {
	console.log('Server is running on port 3001');
});

process.on('SIGINT', () => {
	console.log('SIGINT');
	wss.clients.forEach(function each(client) {
		client.close();
	});
	server.close(() => {
		shutdownDB();
		process.exit(0);
	});
});

/** Websocket **/
const wss = new WebSocketServer({ server });

wss.on('connection', function connection(ws) {
	const numClients = wss.clients.size;
	console.log('Client connected ', numClients);

	wss.broadcast('Current number of clients: ' + numClients);

	if (ws.readyState === ws.OPEN) {
		wss.broadcast('Welcome to my server ' + numClients);
	}

	db.run(`INSERT INTO visitors (count, time) VALUES (${numClients}, datetime('now'))`);

	ws.on('close', function close() {
		wss.broadcast('A client disconnected');
		console.log('A client disconnected');
	});
});

wss.broadcast = function broadcast(data) {
	wss.clients.forEach(function each(client) {
		if (client.readyState === client.OPEN) {
			client.send(data);
		}
	});
};

/** End Websocket */
/** Begin Database */
const db = new sqlite3.Database(':memory:');

db.serialize(() => {
	db.run(`CREATE TABLE IF NOT EXISTS visitors (
    count INTEGER,
    time TEXT
    )`);
});

function getCount() {
	db.each('SELECT count FROM visitors', (err, row) => {
		console.log(row);
	});
}

function shutdownDB() {
	getCount();
	console.log('Database closed');
	db.close();
}

/** End Database */
