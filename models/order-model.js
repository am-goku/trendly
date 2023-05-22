const mongoose = require('mongoose');
const customer = require('./user-model');
const cart = require('./cart-model');
const address = require('./address-model');
const product = require('./product-model');

const orderSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: customer
    },
    order: [{
        orderNo: {
            type: String,
            unique: true
        },
        items: [{
            product: {
                type: mongoose.Schema.Types.ObjectId,
                ref: product
            },
            quantity: {
                type: Number,
            },
            size: {
                type: String
            },
            color: {
                type: String
            },
            productTotal: {
                type: Number
            },

        }],
        totalAmount:{
            type: Number,
            required: true
        },
        discount: {
            type: Number,
            default: 0
        },
        date: {
            type: Date,
            default: Date.now()
        },
        status: {
            type: String,
            default: 'pending'
        },
        address: {
            name: String,
            houseName: String,
            city: String,
            area: String,
            state: String,
            phone: String,
            pincode: String,
        },
        paymentMethod: {
            type: String,
            required: true
        },
    }]
    
},{collection: 'orders'});


const order = mongoose.model('order', orderSchema);

module.exports = order;