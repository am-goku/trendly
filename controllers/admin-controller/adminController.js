//importing helpers
const userHelper = require('../../helpers/userHelpers/userHelper');

//additional variables
const title = 'Admin Panel';
const admin = true;

module.exports = {

    /* `loginCheck` is a middleware function that checks if the `admin` session variable is set. If it
    is set, it calls the `next()` function to move on to the next middleware function. If it is not
    set, it redirects the user to the `/admin/login` route. This function is used to protect routes
    that require authentication, ensuring that only authenticated users can access them. */
    loginCheck: (req, res, next) => {
        if(req.session.admin){
            next();
        } else {
            res.redirect('/admin/login');
        }
    },


    /* This code defines a function called `getHome` that checks if the `admin` session variable is
    set. If it is set, it renders the `admin/dashboard` view with the `title` and `admin` variables
    passed as parameters. If it is not set, it redirects the user to the `/admin/login` route. */
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