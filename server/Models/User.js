const mongoose = require('mongoose');
const { Schema } = mongoose;

const userSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    imageUrl: {
        type: String,
        required: true
    },
    groups: {
        type: Array
    },
    joinDate: {
        type: Date,
        default: Date.now
    }
})

const userModel = mongoose.model('User', userSchema);

module.exports = userModel;