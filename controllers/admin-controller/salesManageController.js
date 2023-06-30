//importing helpers
const salesHelper = require('../../helpers/adminHelpers/salesHelper');

module.exports = {
    getDashboard: (req, res, next) => {
        salesHelper.showSales().then((todaySales)=> {
            res.render('admin/dashboard', {todaySales, admin: req.session.admin});
        }).catch((err)=> {
            console.log('Error in getting dashords', err);
        })
    },


    getSales: (req, res, next) => {
        const time = req.body.time;
        salesHelper.getSales(time).then((sales)=> {
            res.status(200).json({sales});
        }).catch((err)=> {
            console.log('error getting sales in controller', err);
            res.status(200).json({error: true});
        })
    }





}