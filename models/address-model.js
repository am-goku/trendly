const mongoose = require('mongoose');

//models
const user = require('./user-model');


const addressSchema = new mongoose.Schema({
    
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: user
    },

    address: [{
        name: String,

        phone: String,

        houseName: String,

        city: String,

        state: String,

        area: String,

        pincode: String,
        
    }]
    
},{collection: 'user_address'});


const address = mongoose.model('address', addressSchema);

module.exports = address;