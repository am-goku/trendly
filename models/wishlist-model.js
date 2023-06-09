const mongoose = require('mongoose');
const user = require('./user-model');
const product = require('./product-model');

const wishlistSchema = new mongoose.Schema({
  
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: user
    },

    createdAt: {
        type: Date,
        default: Date.now()
    },

    items: [{
        product: {
            type: mongoose.Schema.Types.ObjectId,
            ref: product
        }
    }]
    
},{collection: 'whishlist'});


const wishlist = mongoose.model('wishlist', wishlistSchema);

module.exports = wishlist;