const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const eventSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    text: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        required: true
    },
    time: {
        type: String,
    },
    location: {
        type: String,
    },
    authorName: {
        type: String,
        required: true
    },
    authorImageUrl: {
        type: String,
        required: true
    },
    authorId: {
        type: String,
        required: true
    },
    groupId: {
        type: String,
        required: true
    },
})

const eventModel = mongoose.model('Event', eventSchema);

module.exports = eventModel;