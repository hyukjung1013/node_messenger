const SocketIO = require('socket.io');

module.exports = (server, app, sessionMiddleware) => {
    const io = SocketIO(server, { path: '/socket.io'});
    app.set('io', io);

    // assign namespace
    const room = io.of('/room');
    const chat = io.of('/chat');

    room.on('connection', (socket) => {
        console.log(`Connected to 'room' namespace.`);
        socket.on('disconnect', () => { 
            console.log(`Disconnected to 'room' namespace.`);
        });
    });

    chat.on('connection', (socket) => {
        console.log(`Connected to 'chat' namespace.`);
        const req = socket.request;
        const { headers: { referer } } = req;

        // extract roomId from client URL.
        const roomId = referer.split('/')[referer.split('/').length -1].replace(/\?.+/, '');

        socket.join(roomId);

        socket.on('disconnect', () => { 
            console.log(`Disconnected to 'room' namespace.`);
            socket.leave(roomId);
        });
    });
} 