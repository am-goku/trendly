//importing models
const couponCollection = require('../../models/coupon-model');


module.exports = {
    checkCoupon: (coupon, totalAmount) => {
        return new Promise((resolve, reject) => {
            couponCollection.findOne({ code: coupon.code }).lean()
                .then(async (coupon) => {
                    if (coupon) {
                        const currentDate = new Date();
                        if (currentDate >= coupon.startDate && currentDate <= coupon.expireDate) {
                            // Coupon is valid
                            if (coupon.minAmount < totalAmount && coupon.maxAmount > totalAmount && coupon.discount < totalAmount) {
                                resolve(coupon);
                            } else {
                                resolve(false);
                            }
                        } else {
                            // Coupon has expired
                            resolve(false);
                        }
                    } else {
                        // Coupon not found
                        resolve(false);
                    }
                }).catch((err) => {
                    console.error('error in coupon helper',err);
                });
        })
    }
}