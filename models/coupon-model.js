const mongoose = require('mongoose');

const couponSchema = new mongoose.Schema({
    code: {
        type: String,
        required: true,
      },
      minAmount: {
        type: Number,
        default: 0
      },
      maxAmount: {
        type: Number,
        required: true
      },
      discount: {
        type: Number,
        required: true,
      },
      startDate: {
        type: Date,
        required: true,
      },
      expireDate: {
        type: Date,
        required: true,
      },    
    
},{collection: 'coupons'});


const coupon = mongoose.model('coupon', couponSchema);

module.exports = coupon;