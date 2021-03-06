const mongoose = require('mongoose');

const { Schema } = mongoose;

const roomSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    number: {
        type: Number,
        required: true,
        default: 10,
        min: 2
    },
    owner: {
        type: String,
        createdAt: {
            type: Date,
            default: Date.now
        }
    },
    password: String,
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Room', roomSchema);