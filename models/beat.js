const mongoose = require('mongoose');

const beatSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        default: ''
    },
    price: {
        type: Number,
        default: 0.00
    },
    genre: {
        type: String,
        enum: ['hip-hop', 'trap', 'rnb', 'pop'],
        default: 'hip-hop'
    },
    bpm: {
        type: Number
    },
    key: {
        type: String
    },
    tags: [{
        type: String
    }],
    isPublished: {
        type: Boolean,
        default: false
    },
    filePath: {
        type: String,
        required: true
    },
    coverPath: String,
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Beat', beatSchema);