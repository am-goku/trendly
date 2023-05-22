const session = require('express-session');
const userHelper = require('../../helpers/userHelpers/userHelper');
const customerCollection = require('../../models/user-model');


//additional variables
const title = 'Admin Panel';
let errMsg = false;
let admin = true;

module.exports = {

    loginCheck: (req, res, next) => {
        if(req.session.admin){
            next();
        } else {
            res.redirect('/admin/login');
        }
    },


    getHome: (req, res, next) => {
        if(req.session.admin){
            res.render('admin/dashboard', {title, admin});
        } else {
            res.redirect('/admin/login');
        }
    },




    /* This code defines a function called `getCustomers` that is an asynchronous function. It uses the
    `await` keyword to wait for the `allCustomers` function from the `userHelper` module to
    complete. Once it completes, it retrieves the `customers` data and logs it to the console.
    Finally, it renders the `admin/customers` view with the `customers`, `title`, and `admin`
    variables passed as parameters. */
    getCustomers: async (req, res, next) => {
        await userHelper.allCustomers().then((customers) => {
            console.log(customers);
            res.render('admin/customers', {customers, title, admin});
        })
    },

}