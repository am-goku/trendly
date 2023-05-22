const mongoose = require('mongoose');


const adminSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    phone: {
        type: String,
        required: true
    },
    password:{
        type: String,
        required: true,
    },
    username: {
        type: String,
        required: true
    }
},{collection: 'admin'});


const admin = mongoose.model('admin', adminSchema);

module.exports = admin;