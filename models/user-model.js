const mongoose = require('mongoose');




const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        upperCase: true,
    },
    phone: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    address: {
        flatNo: String,
        street: String,
        city: String,
        state: String,
        pin: Number,
    },
    email: {
        type: String,
        lowerCase: true,
    },
    image: {
        type: String,
    },
    blocked: {
        type: Boolean,
        default: false
    },
    activeStatus: {
        type: Boolean,
        default: false
    },
}, {collection: 'users'});



const user = mongoose.model('user', userSchema);

module.exports = user;