//importing helpers
const orderHelper = require('../../helpers/adminHelpers/orderHelper');
const userHelper = require('../../helpers/userHelpers/orderHelper');


module.exports = {
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