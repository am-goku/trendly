const mongoose = require('mongoose');


const bannerSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },

    subTitle: {
        type: String,
    },

    images: {
        type: String,
        required: true
    },

    link: {
        type: String,
        default: '/products'
    },

    button: {
        type: String,
        required: true
    }
    
},{collection: 'banner'});


const banner = mongoose.model('banner', bannerSchema);

module.exports = banner;