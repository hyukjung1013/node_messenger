const mongoose = require('mongoose');
require('dotenv').config();

const MONGO_ID = process.env.MONGO_ID;
const MONGO_PASSWORD = process.env.MONGO_PASSWORD
const NODE_ENV = process.env.NODE_ENV;

const MONGO_URL = `mongodb://${MONGO_ID}:${MONGO_PASSWORD}@localhost:27017/admin`;
// mongodb://id:password@localhost:27017/database

module.exports = () => {
    const connect = () => {
        if (NODE_ENV !== 'production') {
            mongoose.set('debug', true);
        }
        mongoose.connect(MONGO_URL, {
            dbName: 'node_messenger'
        }, (error) => {
            if (error) {
                console.log('Connection to mongo fails1. : ', error);
            } else {
                console.log('Connection to mongo succeeds.');
            }
        });
    };
    connect();

    mongoose.connection.on('error', (error) => {
        console.log('Connection to mongo fails2. : ', error);
    });

    mongoose.connection.on('disconnected', () => {
        console.error('Disconnected to mongo. Try to connect.');
    });

    require('./chat');
    require('./room');
}