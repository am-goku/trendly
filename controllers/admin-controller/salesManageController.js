//importing helpers
const salesHelper = require('../../helpers/adminHelpers/salesHelper');

module.exports = {
    getDashboard: (req, res, next) => {
        salesHelper.showSales().then((todaySales)=> {
            res.render('admin/dashboard', {todaySales, admin: req.session.admin});
        }).catch((err)=> {
            console.log('Error in getting dashords', err);
            res.redirect('/admin/customers');
        })
    }
}