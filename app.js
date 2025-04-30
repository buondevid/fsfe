const http = require('http');

http.createServer(function (req,res) {
	console.log(`[${new Date().toISOString()}] ${req.method} ${req.url} from ${req.socket.remoteAddress}`);

	res.write("On the way to fullstack!")
	res.end();
}
).listen(3000)

console.log("Server start on port 3000")
