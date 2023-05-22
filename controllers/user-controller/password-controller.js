const session = require('express-session');

const registerHelper = require('../../helpers/userHelpers/registerHelper');
const otpController = require('./otp-controller');
const user = require('../../models/user-model');

const bcrypt = require('bcrypt');


// additional variables
let phoneNumber = null;



module.exports = {
    getForgotPassword: (req, res, next) => {
        res.render('shop/get-phone', {title: 'Reset Password', resetPassword: true});
    },


    postForgotPassword: (req, res, next) => {
        let userData = req.body;
        phoneNumber = req.body.phone;
        let response = registerHelper.checkUser(userData);
        if(response){
            otpController.sendOtp(userData);
            res.render('shop/otp-form', {resetPassword:true, admin:false, phoneNumber})
        }
    },

    updatePassword: (req, res, next) => {
        let userData = req.body;
        registerHelper.updatePassword(userData).then((result) => {
            if(result){
                res.redirect('/login');
            } else {
                res.redirect('/forgotPassword');
            }
        })
    },

    varifyOtp: (req, res, next) => {
        let userData = req.body;
        otpController.verifyOtp(userData).then((result) => {
            if(result){
                res.redirect('/resetPassword');
            } else {
                res.render('shop/otp-form', {title, otpMsg: 'Invalid Otp', phoneNumber})
            }
        })

    },


    getResetPassword: (req, res, next) => {
        res. render('shop/passwordRest', {phoneNumber});
    },

    checkPassword: (req, res, next) => {
        console.log('entered the area');
        let oldPassword = req.body.oldPassword;
        let newPassword = req.body.newPassword;
        let user = req.session.user;
        console.log(req.body.oldPassword);
        let response = {};

        return new Promise((resolve, reject) => {
            if(oldPassword === newPassword){
                response.samePasswords = true;
            }

            bcrypt.compare(oldPassword, user.password).then((stat)=>{
                response.oldPasswordCheck = stat;
                res.status(200).json(response);
            })
        })



        // bcrypt.compare(oldPassword, user.password).then((status)=>{
        //     console.log(status);
        //     response.oldPasswordCheck = status;
        //     if(oldPassword === newPassword){
        //         response.samePasswords = true;
        //     }
        //     console.log(response);
        //     res.json(response);
        // })
    },


    changePassword: async(req, res, next) => {
        let oldPassword = req.body.oldPassword;
        let newPassword = req.body.newPassword;
        let user = req.session.user;

        await bcrypt.compare(oldPassword, newPassword).then((status) => {
            if(status){
                let newUserData = { phone : user.phone, password: newPassword };
                registerHelper.updatePassword(newUserData)
            } else {
                res.status(200).json({})
            }
        })
    }

    
}