const session = require('express-session');
const userHelper = require('../../helpers/userHelpers/userHelper');
const { response } = require('express');

const loginController = require('./login-controller');
const categoryHelper = require('../../helpers/productHelpers/categoryHelper');

//additional variables
let user = false;
let customer = null;


module.exports = {
    /* `userLoginStatus` is a middleware function that checks if the user is logged in or not. It
    checks if the `loggedIn` property is set in the `req.session` object. If it is set, it calls the
    `next()` function to pass control to the next middleware function. If it is not set, it
    redirects the user to the login page. */
    userLoginStatus: async (req, res, next) => {
        if(req.session.loggedIn){
            next();
        } else {
            res.redirect('/login');
        }
    },

    /* `getLoginUserStatus` is a middleware function that checks if the user is already logged in or
    not. If the user is already logged in, it redirects the user to the home page. If the user is
    not logged in, it calls the `next()` function to pass control to the next middleware function. */
    getLoginUserStatus: (req, res, next) => {
        if(req.session.loggedIn){
            res.redirect('/');
        } else {
            next();
        }
    },

    /* `checkBlockedStatus` is a middleware function that checks if a user's phone number is blocked or
    not. It takes in the `req`, `res`, and `next` parameters. It first extracts the phone number
    from the request body. It then calls the `findBlockStatus` function from the `userHelper` module
    to check if the phone number is blocked or not. If the phone number is blocked, it renders the
    login page with a `blocked` parameter set to `true`. If the phone number is not blocked, it
    calls the `next()` function to pass control to the next middleware function. */
    checkBlockedStatus:  (req, res, next) => {
        let phone = req.body.phone;
         userHelper.findBlockStatus(phone).then((response) => {
            if(response){
                if (response.blocked) {
                    console.log(response);
                    res.render('shop/login', {blocked:true, admin:false, title:'Login'});                
                } else {
                    next();
                }
            } else {
                next();
            }
        })
    },

    /* `getHome` is a controller function that renders the home page of the website. It first checks if
    the user is logged in by checking the `loggedIn` property in the `req.session` object. It then
    sets the `user` and `customer` variables based on the `req.session` object. It also sets the
    `category` variable by calling the `allCategory` function from the `categoryHelper` module.
    Finally, it renders the `shop/index` view with the appropriate variables passed in as
    parameters. If the user is logged in, it renders the view with the `user` and `customer`
    variables, otherwise it renders the view without them. */
    getHome: (req, res, next) => {
        user = req.session.loggedIn;
        customer = req.session.user;
        let category = categoryHelper.allCategory;
        if(user){
                res.render('shop/index', {title: 'Trendly', user, customer, homeActive:true});
        } else {
                res.render('shop/index', {title: 'Trendly', homeActive:true});
        }
    },



    /* `getProfile` is a controller function that renders the user's profile page. It first sets the
    `customer` and `user` variables based on the `req.session` object. It then calls the
    `getAddress` function from the `userHelper` module to get the user's address. If the user has an
    address, it renders the `shop/profile` view with the `user`, `customer`, `profilePage`, and
    `address` variables passed in as parameters. If the user does not have an address, it renders
    the `shop/profile` view with the `user`, `customer`, and `profilePage` variables passed in as
    parameters. If there is an error fetching the address, it logs the error to the console. */
    getProfile: async (req, res, next) => {
        try {
            let customer = user = req.session.user;
            let userAddress = await userHelper.getAddress(user._id);
            if(userAddress){
                let address = userAddress.address;
                res.render('shop/profile', { user, customer, profilePage:true, address });
            } else {
                res.render('shop/profile', { user, customer, profilePage:true });
            }
        } catch (err) {
            console.log('Error fetching address'+err);
        }
    }

    
    



}