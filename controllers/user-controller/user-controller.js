const session = require('express-session');
const userHelper = require('../../helpers/userHelpers/userHelper');
const { response } = require('express');

const loginController = require('./login-controller');
const categoryHelper = require('../../helpers/productHelpers/categoryHelper');

//additional variables
let user = false;
let customer = null;


module.exports = {
    userLoginStatus: async (req, res, next) => {
        if(req.session.loggedIn){
            next();
        } else {
            res.redirect('/login');
        }
    },

    getLoginUserStatus: (req, res, next) => {
        if(req.session.loggedIn){
            res.redirect('/');
        } else {
            next();
        }
    },

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