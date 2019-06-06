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
        res.redirect('/');
    } catch(err) {
        console.error(err);
        next(err);
    }

    res.render('main');
});

router.get('/room/:id', async (req, res, next) => {

});

router.get('/room', (req, res) => {
    res.render('room');
});

module.exports = router;