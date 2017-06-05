//import { Game } from "./game";

//let game = new Game(gameContainer);

import * as Server from 'http';
import * as SocketIO from 'socket.io';

let server = Server.createServer();
let io = SocketIO(server);

io.on('connection', (socket: SocketIO.Socket) => {
    console.log('A new client connected');

    socket.on('event', (data: any) => {
        console.log(data);
    });
    socket.on('disconnect', () => {
        console.log('One client disconnected');
    });
});

// // app.get('/', (req: Express.Request, res: Express.Response) => {
// //     res.send('Hello World');
// });

let port = 3000;

server.listen(port);
console.log('Server listens on port ' + port);