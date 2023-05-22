const { response } = require('express');
const userHelper = require('../../helpers/userHelpers/userHelper');
const cart = require('../../models/cart-model')

//importing helpers
const orderHelper = require('../../helpers/userHelpers/orderHelper');



const orderManagement = {
    /* This is a method called `showAddress` that handles a GET request to display the address of a
    logged-in user. It first gets the user's ID from the session, then uses the `getAddress` method
    from the `userHelper` module to retrieve the user's address. It then uses the `findOne` method
    from the `cart` model to retrieve the total amount of the user's cart. Finally, it renders the
    `checkout` view with the user's address, customer information, and total amount of the cart. */
    showAddress: (req, res, next) => {
        userId = req.session.user._id;

        userHelper.getAddress(userId).then((user_address) => {
            cart.findOne({userId: req.session.user._id}).then((response) => {
                console.log(user_address.address[0]);
                res.render('shop/checkout', {address: user_address.address, customer: req.session.user, totalAmount: response.totalAmount});
            })
            
        })
    },



    /* This is a method called `showOrders` that handles a GET request to display the orders of a
    logged-in user. */
    showOrders: (req, res, next) => {
        let customer = user = req.session.user;
        let userId = req.session.user._id;
        userHelper.getOrders(userId).then((response) => {
            let orders = response.order
            for(let i = 0; i < orders.length; i++) {
                orders[i].no = orders[i].products.length;
            }
            res.render('shop/orders', {orders, customer, user })
        })
    },


    getAnOrder: (req, res, next) => {
        let orderId = req.query.orderId;
        let userId = req.session.user._id;
        orderHelper.getAnOrder(orderId, userId). then((order) => {
            if(order){
                res.render('shop/orderDetails', {order, user: req.session.user})
            }
        })
    }






}



module.exports = orderManagement;