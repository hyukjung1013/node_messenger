const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
    res.render('main');
});

router.get('/room', (req, res) => {
    res.render('room');
});

router.get('/create_room', (req, res) => {
    res.render('create_room');
});

module.exports = router;