const express = require('express');
const router = express.Router();

const Room = require('../schemas/room');
const Chat = require('../schemas/chat');

router.get('/', async (req, res) => {
    try {
        const rooms = await Room.find({});
        if(rooms) {
            res.render('main', {
                rooms: rooms,
            });
        } else {
            res.render('main', {
                rooms: [],
            });
        }
    } catch(err) {
        console.error(err);
        next(err);
    }
});

router.get('/create_room', (req, res) => {
    res.render('create_room');
});

router.post('/create_room_process', async (req, res) => {

    const { title, number, password } = req.body;

    try {
        const room = new Room({
            title: title,
            number: number,
            owner: req.session.color,
            password: password
        });
        const newRoom = await room.save();
        const io = req.app.get('io');
        io.of('/room').emit('newRoom', newRoom);
        res.redirect(`/room/${newRoom._id}?password=${req.body.password}`);
    } catch(err) {
        console.error(err);
        next(err);
    }
});

router.get('/room/:id', async (req, res, next) => {
    try {
        const room = await Room.findOne({ _id: req.params.id });
        const io = req.app.get('io');

        if(!room) {
            return res.redirect('/');
        }

        if( room.password && room.password !== req.query.password ) {
            return res.redirect('/');
        }

        const { rooms } = io.of('/chat').adapter;
        if (rooms && rooms[req.params.id] && room.number <= rooms[req.params.id].length) {
            return res.redirect('/');
        }

        const chats = await Chat.find({ room: room._id }).sort('createdAt');

        if (chats) {
            return res.render('room', {
                room: room,
                chats: chats,
                user: req.session.color
            });
        } else {
            return res.render('chat', {
                room: room,
                chats: [],
                user: req.session.color
            });
        }

    } catch(err) {
        console.error(err);
        return next(err);
    }
});

router.post('/room/:id/chat', async (req, res, next) => {
    try {
        const chat = new Chat({
            room: req.params.id,
            user: req.session.color,
            chat: req.body.chat
        });
        await chat.save();
        req.app.get('io').of('/chat').to(req.params.id).emit('chat', chat);
        res.send('ok');
    } catch(err) {
        console.error(err);
        next(err);
    }
});

router.delete('/room/:id', async(req, res, next) => {
    try {
        await Room.remove({ _id: req.params.id });
        await Chat.remove({ room: req.params.id });
        res.send('ok');
        setTimeout(() => {
            req.app.get('io').of('/room').emit('removeRoom', req.params.id);
        }, 2000);
    } catch (err) {
        console.error(err);
        next(err);
    }
});

module.exports = router;