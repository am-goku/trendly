const { response } = require('express');
const userHelper = require('../../helpers/userHelpers/userHelper');
const cart = require('../../models/cart-model')

//importing helpers
const orderHelper = require('../../helpers/userHelpers/userOrderHelper');



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



    
    /* `showOrders` is a method that handles a GET request to display the orders of a logged-in user.
    It first gets the user's ID from the session, then uses the `getOrders` method from the
    `userHelper` module to retrieve the user's orders. If the user has orders, it adds a `no`
    property to each order object, which represents the number of items in the order. Finally, it
    renders the `orders` view with the user's orders and customer information. If the user has no
    orders, it renders the `orders` view with a message indicating that there are no orders. */
    showOrders: (req, res, next) => {
        let customer = user = req.session.user;
        let userId = req.session.user._id;
        userHelper.getOrders(userId).then((response) => {
            if(response){
                let orders = response.order
                for(let i = 0; i < orders.length; i++) {
                    orders[i].no = orders[i].items.length;
                }
                res.render('shop/orders', {orders, customer, user })
            } else {
                res.render('shop/orders', {noOrders: true, customer, user})
            }
        })
    },


    /* `getAnOrder` is a method that handles a GET request to retrieve the details of a specific order.
    It first gets the order ID and user ID from the request query and session respectively. It then
    uses the `getAnOrder` method from the `orderHelper` module to retrieve the order details. If the
    order is found, it renders the `orderDetails` view with the order details and customer
    information. */
    getAnOrder: (req, res, next) => {
        let orderId = req.query.orderId;
        let userId = req.session.user._id;
        orderHelper.getAnOrder(orderId, userId).then((order) => {
            if(order){
                res.render('shop/orderDetails', {order, customer: req.session.user})
            }
        })
    },


    /* `cancelOrder` is a method that handles a request to cancel an order. It first gets the order ID
    and user ID from the request query and session respectively. It then uses the `cancelOrder`
    method from the `orderHelper` module to cancel the order. If the order is successfully
    cancelled, it sends a JSON response with a status code of 200 and the response data. If there is
    an error, it logs the error and sends a JSON response with a status code of 400 and an error
    message. */
    cancelOrder: (req, res, next) => {
        try{
            let orderId = req.query.orderId;
            let userId = req.session.user._id;
            orderHelper.cancelOrder(orderId, userId).then((response) => {
                res.status(200).json(response)
            }).catch((error) => {
                res.status(400).json({message: 'Somethings wrong cancelling order'})
            })
        } catch (error) {
            console.log('error in controller while canceling the order', error);
        }
    },




    /* `returnOrder` is a method that handles a POST request to return an order. It first gets the
    order ID and user ID from the request query and session respectively. It then uses the
    `returnOrder` method from the `orderHelper` module to return the order. If the order is
    successfully returned, it sends a JSON response with a status code of 200 and the response data.
    If there is an error, it logs the error and redirects to the `/order` page. */
    returnOrder: (req, res, next) => {
        let orderId = req.query.orderId;
        let userId = req.session.user._id;

        orderHelper.returnOrder(orderId, userId).then((response) => {
            res.status(200).json(response);
        }).catch((err) => {
            console.log('Error in returnOrder Controller:', err);
            res.redirect('/order');
        })
    }






}



module.exports = orderManagement;