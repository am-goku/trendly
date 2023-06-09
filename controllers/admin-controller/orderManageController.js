//importing helpers
const orderHelper = require('../../helpers/adminHelpers/orderHelper');


module.exports = {
    /* This is a controller function that is responsible for rendering the orders page for the admin.
    It first calls the `getOrders()` function from the `orderHelper` module to retrieve all the
    orders. Then, it formats the date of each order and renders the `admin/orders` view with the
    `orders` data. If there is an error, it logs the error to the console. */
    showOrders: (req, res, next) => {
        try {
            orderHelper.getOrders().then((orders) => {
                console.log('orders are :::', orders);
                if(orders) {
                    for(let i=0; i<orders.length; i++) {
                        let today = orders[i].order.date;
                        let year = today.getFullYear();
                        let month = String(today.getMonth() + 1).padStart(2, '0');
                        let day = String(today.getDate()).padStart(2, '0');
                        orders[i].order.date = `${day}-${month}-${year}`;
                    }
                    res.render('admin/orders', {admin:req.session.admin, title:'admin', orders})
                } else {
                    res.render('admin/orders', {admin:req.session.admin, title:'admin', orders})
                }
            })
        } catch (err) {
            console.log('Error getting showing orders', err);
        }
    },

    /* This is a controller function that is responsible for getting the details of a specific order
    and rendering the `admin/orderDetails` view with the order data. It takes in the `req` and `res`
    objects as parameters and uses the `query` property of the `req` object to retrieve the
    `orderId` and `userId` of the order. It then calls the `getOrderDetails()` function from the
    `orderHelper` module, passing in the `orderId` and `userId` as arguments. Once the order details
    are retrieved, it renders the `admin/orderDetails` view with the order data and the `admin`
    object from the `req.session` object. If there is an error, it logs the error to the console. */
    getOrderDetails: (req, res, next) => {
        try{
            let orderId = req.query.orderId;
            let userId = req.query.userId;

            orderHelper.getOrderDetails(orderId, userId).then((response) => {
                res.render('admin/orderDetails', {order: response.order[0], admin: req.session.admin});
                // res.redirect('/admin')
            })
            
            console.log('orderId and userId', orderId, userId);
            
        } catch (err) {
            console.log('error in controller while getting order details', err);
        }
    },


    /* `manageOrder` is a controller function that is responsible for updating the status of an order.
    It takes in the `req` and `res` objects as parameters and uses the `query` property of the `req`
    object to retrieve the `orderStatus`, `orderId`, and `userId` of the order. It then calls the
    `manageOrder()` function from the `orderHelper` module, passing in the `orderStatus`, `orderId`,
    and `userId` as arguments. Once the order status is updated, it redirects to the
    `admin/orderDetails` view with the `orderId` and `userId` as query parameters. The updated order
    status is logged to the console. */
    manageOrder: (req, res) => {
        let orderStatus = req.query.status;
        let orderId = req.query.orderId;
        let userId = req.query.userId;

        orderHelper.manageOrder(orderStatus, orderId, userId).then((response) => {
            console.log('response after changing the order status:', response);
            res.redirect('/admin/orders/details?orderId='+orderId+'&userId='+userId);
        })
    }
}