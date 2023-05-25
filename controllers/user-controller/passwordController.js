const session = require('express-session');

const registerHelper = require('../../helpers/userHelpers/registerHelper');
const otpController = require('./otpController');
const user = require('../../models/user-model');

const bcrypt = require('bcrypt');


// additional variables
let phoneNumber = null;



module.exports = {
    /* This is a controller function that renders a view called 'get-phone' with the title 'Reset
    Password' and a boolean value of 'true' for the 'resetPassword' key in the object passed as the
    second argument to the 'render' method. It is used to display a form where the user can enter
    their phone number to initiate the password reset process. */
    getForgotPassword: (req, res, next) => {
        res.render('shop/get-phone', {title: 'Reset Password', resetPassword: true});
    },


    /* This function is handling the POST request for the forgot password feature. It retrieves the
    user data from the request body and sets the phoneNumber variable to the phone number entered by
    the user. It then calls the checkUser function from the registerHelper module to check if the
    user exists. If the user exists, it calls the sendOtp function from the otpController module to
    send an OTP to the user's phone number. Finally, it renders the 'otp-form' view with the
    resetPassword, admin, and phoneNumber variables passed as arguments. */
    postForgotPassword: (req, res, next) => {
        let userData = req.body;
        phoneNumber = req.body.phone;
        let response = registerHelper.checkUser(userData);
        if(response){
            otpController.sendOtp(userData);
            res.render('shop/otp-form', {resetPassword:true, admin:false, phoneNumber})
        }
    },

    /* This function is handling the updating of a user's password. It retrieves the user data from the
    request body and passes it to the `updatePassword` function from the `registerHelper` module. If
    the update is successful, it redirects the user to the login page. If the update is not
    successful, it redirects the user to the forgot password page. */
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

    /* This function is handling the verification of the OTP entered by the user. It retrieves the user
    data from the request body and passes it to the `verifyOtp` function from the `otpController`
    module. If the OTP is verified successfully, it redirects the user to the reset password page.
    If the OTP is not verified successfully, it renders the 'otp-form' view with an error message
    indicating that the OTP entered is invalid. */
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


    /* This is a controller function that renders a view called 'passwordRest' with the phoneNumber
    variable passed as an argument. It is used to display a form where the user can reset their
    password after verifying their OTP. */
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


    /* This function is handling the change of a user's password. It retrieves the old and new password
    data from the request body and the user data from the session. It then uses the `bcrypt.compare`
    method to compare the old and new passwords. If they are the same, it returns an empty JSON
    object. If they are different, it calls the `registerHelper.updatePassword` function to update
    the user's password with the new password. */
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