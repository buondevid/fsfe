import express from 'express';
import http from 'http';
import { WebSocketServer } from 'ws';
import path from 'path';
import { fileURLToPath } from 'url';

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

/** Websocket **/
const wss = new WebSocketServer({ server });

wss.on('connection', function connection(ws) {
	const numClients = wss.clients.size;
	console.log('Client connected ', numClients);

	wss.broadcast('Current number of clients: ' + numClients);

	if (ws.readyState === ws.OPEN) {
		wss.broadcast('Welcome to my server ' + numClients);
	}

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
