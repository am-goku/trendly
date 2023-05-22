const couponCollection = require('../../models/coupon');
const cartCollection = require('../../models/cart-model');




module.exports = {
    checkCoupon: (req, res, next) => {
        try{
            const { code } = req.body;
            let userId = req.session.user._id;

            couponCollection.findOne({ code })
                .then(async (coupon) => {
                    if (coupon) {
                        const currentDate = new Date();
                        if (currentDate >= coupon.startDate && currentDate <= coupon.expireDate) {
                            // Coupon is valid

                            await cartCollection.updateOne({userId: userId}, { $inc: { totalAmount: -coupon.discount } }).then(()=> {
                                res.json({ valid: true, discount: coupon.discount });
                            })


                        } else {
                            // Coupon has expired
                            res.json({ valid: false, message: 'Coupon has expired' });
                        }
                    } else {
                        // Coupon not found
                        res.json({ valid: false, message: 'Invalid coupon code' });
                    }
                })
                .catch((err) => {
                    console.error(err);
                    res.json({ valid: false, message: 'An error occurred' });
                });
            } catch (err) {
                console.log('error occured while validating coupon code:: ', err);
            }

    },


    cancelCoupon: (req, res) => {
        try{
            const { code } = req.body;
            let userId = req.session.user._id;

            couponCollection.findOne({ code })
                .then(async (coupon) => {
                    await cartCollection.updateOne({userId: userId}, { $inc: { totalAmount: coupon.discount } });

                    res.json({ status: true });
                })
                .catch((err) => {
                    console.error(err);
                    res.json({ status: false, message: 'An error occurred' });
                });
        } catch (err) {
            console.log('errror occured while canceling order:: ', err);
        }
    },


    getActiveCoupons: () => {
        return new Promise((resolve, reject) => {
            let currentDate = new Date();
            couponCollection.find({ startDate: {$lte: currentDate}, expireDate: {$gte:currentDate} }).lean()
            .then((response) => {
                resolve(response);
            }).catch((err) => {
                console.log('Error getting active coupon:: ', err);
            })
        })
    }
}