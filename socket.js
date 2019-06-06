const SocketIO = require('socket.io');
const axios = require('axios');

module.exports = (server, app, sessionMiddleware) => {
    const io = SocketIO(server, { path: '/socket.io'});
    app.set('io', io);

    // assign namespace
    const room = io.of('/room');
    const chat = io.of('/chat');

    io.use((socket, next) => {
        sessionMiddleware(socket.request, socket.request.res, next);
    });

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

        socket.to(roomId).emit('join', {
            user: 'system',
            chat: `${req.session.color} entered.`
        });

        socket.on('disconnect', () => { 
            console.log(`Disconnected to 'room' namespace.`);
            socket.leave(roomId);

            const currentRoom = socket.adapter.rooms[roomId];
            const userCount = currentRoom ? currentRoom.length : 0;

            if (userCount === 0) {
                axios.delete(`http://localhost:9004/room/${roomId}`)
                .then(() => {
                    console.log('Request to remove room succeed.');
                })
                .catch((err) => {
                    console.log(error);
                });
            } else {
                socket.to(roomId).emit('exit', {
                    user: 'system',
                    chat: `${req.session.color} exits.`
                });
            }
        });
    });
} 