


// importing helper functions
const userHelper = require('../../helpers/userHelpers/userHelper');
const paymentHelper = require('../../helpers/userHelpers/paymentHelper');


const paymentController = {

    doPayment: (req, res, next) => {
        try{
            let address = req.body.address;
            let paymentMethod = req.body.paymentMethod;
            let userId = req.session.user._id;
            let coupon = req.session.couponActive ? req.session.couponActive : null;
            console.log('eneterd the payment section');

            if(paymentMethod === 'cod'){
                paymentHelper.completeOrder(userId, address, paymentMethod, coupon).then((response) => {
                    console.log('cod', response);
                    req.session.lastOrder = response.order[response.order.length-1];
                    console.log('sessinorder', req.session.lastOrder);
                    res.status(200).send({codSuccess: 'true'});
                })
            } else if (paymentMethod === 'razorpay') {
                paymentHelper.completeOrder(userId, address, paymentMethod, coupon).then((response) => {
                    console.log('rzp', response);
                    req.session.lastOrder = response.order[response.order.length-1];
                    let orderId = req.session.lastOrder._id;
                    let total = req.session.lastOrder.totalAmount
                    console.log('sessinorder', req.session.lastOrder);

                    //razorpay
                    paymentHelper.generateRazorpay(orderId, total).then((resp) => {
                        res.status(200).json(resp);
                    })
                })
            } else {
                res.send(404, {message: 'paypal'})
            }

        } catch (err) {
            console.log('Payment Error: ', err);
        }
    },

}











module.exports = paymentController;