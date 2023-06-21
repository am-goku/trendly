const { ObjectId } = require('mongodb');
const mongoose = require('mongoose');
const category = require('./category-model');
const brands = require('./brand-model')


const productSchema = new mongoose.Schema({
    productName: {
        type: String,
        required: true,
        upperCase: true
    },

    description: {
        type: String,
        required: true,
    },

    productPrice: {
        type: Number,
        required: true,
    },

    discountPercentage: {
        type: Number,
        default: 0
    },

    stock: {
        type: Number,
        default: 0,
        min: 0,
    },

    brand: {
        type: mongoose.Schema.Types.ObjectId,
        ref: brands,
    },

    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: category,
        required: true
    },

    images: {
        type: Array,
    },

    color: [String],

    size: [String],

    addedAt: {
        type: Date,
        default: new Date()
    }

},{collection: 'products'})


let product = mongoose.model('product', productSchema);

module.exports = product;