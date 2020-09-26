const mongoose = require('mongoose');
const { Schema } = mongoose;

const messageSchema = new Schema ({
    text: {
        type: String,
        required: true
    },
    authorId: {
        type: String,
        required: true
    },
    authorName: {
        type: String,
        required: true
    },
    authorImageUrl: {
        type: String,
        required: true
    },
    groupId: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    }
}, { timestamps: true });

const messageModel = mongoose.model('Message', messageSchema);

module.exports = messageModel;