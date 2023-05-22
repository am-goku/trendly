const customer = require('../../models/user-model');
const registerHelper = require('../../helpers/userHelpers/registerHelper');
const bcrypt = require('bcrypt');
const session = require('express-session');
const otpController = require('./otp-controller');

// additional resources:
let title = 'Register';
let regUser = false;
let phoneNumber = null;
let otpValid = false;



module.exports = {

    getRegister: (req, res, next) => {
        if(req.session.loggedIn){
            res.redirect('/');
        } else if(otpValid) {
            res.render('shop/register', { title, phoneNumber})
            otpValid = false;
            phoneNumber = null;
        } else {
            res.redirect('/register/phone');
        }
    },

    postRegister: async (req, res, next) => {

        let userData = req.body;
        userData.password = await bcrypt.hash(userData.password, 10);
        await registerHelper.doRegister(userData);
        res.redirect('/login');

    },


    getPhoneNumer: (req, res, next) => {
        if (req.session.loggedIn) {
            res.redirect('/');
        } else {
            res.render('shop/get-phone', { title, regUser });
            regUser = false;
        }
    },

    postPhoneNumber: async (req, res, next) => {

        let userData = req.body;
        regUser = await registerHelper.checkUser(userData);
        if(!regUser){
            phoneNumber = userData.phone;
            otpController.sendOtp(userData);
            res.render('shop/otp-form', {title, phoneNumber});
        } else {
            res.redirect('/register/phone');
        }

    },

    otpVerification: (req, res) => {
        let userData = req.body;
        otpController.verifyOtp(userData).then((status) => {
            console.log(status);
            if(status.valid) {
                otpValid = true;
                res.redirect('/register');
                // res.render('shop/register', {title: 'Register', phoneNumber});
                // phoneNumber = null;
            } else {
                res.render('shop/otp-form', {title, otpMsg: 'Invalid Otp', phoneNumber});
            }
        }) 
    }


}