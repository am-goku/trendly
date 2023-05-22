const mongoose = require('mongoose');


const brandSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },

    icon: {
        type: String
    }
    
},{collection: 'brands'});


const brands = mongoose.model('brand', brandSchema);

module.exports = brands;