const couponCollection = require('../../models/coupon-model');
const cartCollection = require('../../models/cart-model');




module.exports = {


    /* This is a function called `checkCoupon` that takes in three parameters: `req`, `res`, and
    `next`. It is an asynchronous function that first extracts the coupon code and user ID from the
    request body and session, respectively. It then uses the `cartCollection` and `couponCollection`
    models to find the user's cart and the coupon with the given code, respectively. */
    checkCoupon: async (req, res, next) => {
        try{
            const { code } = req.body;
            const userId = req.session.user._id;
            const cart = await cartCollection.findOne({ userId: userId});

            couponCollection.findOne({ code })
                .then(async (coupon) => {
                    if (coupon) {
                        const currentDate = new Date();
                        if (currentDate >= coupon.startDate && currentDate <= coupon.expireDate) {
                            // Coupon is valid
                                if(coupon.minAmount < cart.totalAmount && coupon.maxAmount > cart.totalAmount && coupon.discount < cart.totalAmount) {
                                    req.session.couponActive = coupon;
                                    res.json({ valid: true, coupon: coupon.code, discount: coupon.discount });
                                } else {
                                    req.session.couponActive = null;
                                    res.json({ valid: false, message: 'Coupon is not applicable' });
                                }
                        } else {
                            // Coupon has expired
                            req.session.couponActive = null;
                            res.json({ valid: false, message: 'Coupon has expired' });
                        }
                    } else {
                        // Coupon not found
                        req.session.couponActive = null;
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




    /* `cancelCoupon` is a function that takes in two parameters `req` and `res`. It tries to extract
    the coupon code and user ID from the request body and session, respectively. It then uses the
    `couponCollection` model to find the coupon with the given code. If the coupon is found, it
    updates the user's cart by subtracting the discount amount from the total amount and returns a
    JSON response with a `status` of `true`. If there is an error, it returns a JSON response with a
    `status` of `false` and an error message. If an error occurs in the try block, it logs the error
    to the console. */
    cancelCoupon: (req, res) => {
        try{
            const { code } = req.body;
            const userId = req.session.user._id;

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


    /* `getActiveCoupons` is a function that returns a promise. It uses the `couponCollection` model to
    find all coupons that have a `startDate` less than or equal to the current date and an
    `expireDate` greater than or equal to the current date. It then resolves the promise with the
    response from the database query. If there is an error, it logs the error to the console. */
    getActiveCoupons: () => {
        return new Promise((resolve, reject) => {
            const currentDate = new Date();
            couponCollection.find({ startDate: {$lte: currentDate}, expireDate: {$gte:currentDate} }).lean()
            .then((response) => {
                resolve(response);
            }).catch((err) => {
                console.log('Error getting active coupon:: ', err);
            })
        })
    },


    
}