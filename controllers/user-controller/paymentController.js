// importing helper functions
const userHelper = require('../../helpers/userHelpers/userHelper');
const paymentHelper = require('../../helpers/userHelpers/paymentHelper');


const paymentController = {

    /* `doPayment` is a method of the `paymentController` object. It takes in three parameters: `req`,
    `res`, and `next`, which are objects representing the HTTP request, response, and next
    middleware function in the application's request-response cycle. */
    doPayment: (req, res, next) => {
        try{
            const address = req.body.address;
            const paymentMethod = req.body.paymentMethod;
            const userId = req.session.user._id;
            const coupon = req.session.couponActive ? req.session.couponActive : null;

            if(paymentMethod === 'cod'){
                paymentHelper.completeOrder(userId, address, paymentMethod, coupon).then((response) => {
                    req.session.lastOrder = response.order[response.order.length-1];
                    res.status(200).send({codSuccess: 'true'});
                })
            } else if (paymentMethod === 'razorpay') {
                paymentHelper.getTotalAmount(userId, coupon).then((response) => {
                    if(!response.error){
                        // res.status(200).json({orderNo: response.orderNo, finalAmount: response.finalAmount, coupon: coupon, address: address});
                        paymentHelper.generateRazorpay(response.orderNo, response.finalAmount).then((resp) => {
                            res.status(200).json({...resp, address, coupon, finalAmount:response.finalAmount});
                        }).catch((err) => {
                            console.log('Error in controller while generatingazorpay', err);
                        })
                    }
                })


                // paymentHelper.completeOrder(userId, address, paymentMethod, coupon).then((response) => {
                //     req.session.lastOrder = response.order[response.order.length-1];
                //     const orderId = req.session.lastOrder._id;
                //     const total = req.session.lastOrder.totalAmount;
                //     //razorpay
                //     paymentHelper.generateRazorpay(orderId, total).then((resp) => {
                //         res.status(200).json(resp);
                //     })
                // })
            } else {
                res.send(404, {message: 'paypal'})
            }
        } catch (err) {
            console.log('Payment Error: ', err);
        }
    },

    doRzpPayment: (req, res, next) => {
        try {
            const address = req.body.address;
            const paymentMethod = 'razorpay'
            const userId = req.session.user._id;
            const couponCode = req.body.coupon;
            const amount = req.body.amount;
            const orderNo = req.body.orderNo;
            paymentHelper.rzpPayment(userId, address, paymentMethod, couponCode, orderNo, amount).then((response)=> {
                console.log(response);
                req.session.lastOrder = response.order[response.order.length-1];
                res.status(200).json({response, rzpStatus: true});
            }).catch((err) => {
                console.log('something went wrong', err)
                res.status(200).json({rzpStatus: false});
            })
        } catch (error) {
            console.log('Error in payment rzp controller', error);
        }
    }

}











module.exports = paymentController;