import express from 'express';
import http from 'http';
import WebSocket from 'ws';

const app = express();
const server = http.createServer(app);

app.get('/', (req, res) => {
	res.sendFile('index.html', { root: __dirname });
});

server.on('request', app);
server.listen(3001, () => {
	console.log('Server is running on port 3001');
});

/** Websocket **/
const WSS = new WebSocket.Server({ server });

WSS.on('connection', function connection(ws) {
	const numClients = WSS.clients.size;
	console.log('Client connected ', numClients);

	WSS.broadcast('Current number of clients: ' + numClients);

	if (ws.readyState === ws.OPEN) {
		WSS.broadcast('Welcome to my server ' + numClients);
	}

	ws.on('close', function close() {
		WSS.broadcast('A client disconnected');
		console.log('A client disconnected');
	});
});

WSS.broadcast = function broadcast(data) {
	WSS.clients.forEach(function each(client) {
		if (client.readyState === client.OPEN) {
			client.send(data);
		}
	});
};
