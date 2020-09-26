const mongoose = require('mongoose');
const { Schema } = mongoose;

const groupSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    imageUrl: {
        type: String,
        required: true
    },
    members: {
        type: Array,
        required: true
    },
    admins: {
        type: Array,
        required: true
    },
    ownerId: {
        type: String,
        required: true
    },
    chatIds: {
        type: Array,
        required: false
    },
    eventIds: {
        type: Array,
        required: false
    },
    joinCode: {
        type: String,
        required: true
    },
    creationDate: {
        type: Date,
        default: Date.now
    }
})

const groupModel = mongoose.model('Group', groupSchema);

module.exports = groupModel;