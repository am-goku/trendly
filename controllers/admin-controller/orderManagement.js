//importing helpers
const orderHelper = require('../../helpers/adminHelpers/orderHelper');


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
    }
}