const session = require('express-session');

const loginHelper = require('../../helpers/adminHelpers/loginHelper');

const otpservice = require('../user-controller/otpController');



//admin credentials
const adminCredentials = {
    username: 'amgoku',
    password: '2483',
}

//additional variables
const title = 'Admin Panel';
let errMsg = false;
let admin = true;


module.exports = {

    /* This is a function that handles the GET request for the login page for the admin panel. It
    checks if there is an active admin session, and if so, redirects to the admin dashboard. If
    there is no active session, it renders the login page with the appropriate variables passed in
    as an object. The `title` variable is set to 'Admin Panel', `errMsg` is set to false, `admin` is
    set to true, and `notActive` is set to true. The `errMsg` variable is set to false to ensure
    that any previous error messages are cleared before rendering the login page. */
    getLogin: (req, res, next) => {
        if(req.session.admin){
            res.redirect('/admin');
        } else {
            res.render('admin/login', {title, errMsg, admin, notActive: true});
            errMsg = false;
        }
    },

    /* `postLogin` is a function that handles the POST request for the admin login page. It takes in
    the `req`, `res`, and `next` parameters. It first gets the `adminData` from the request body. It
    then calls the `postLogin` function from the `loginHelper` module, passing in the `adminData`.
    The `postLogin` function returns a promise, which is handled using `.then()`. If the response is
    truthy, it checks if the password in the response matches the password in the `adminData`. If it
    does, it sets the `admin` session to the response and redirects to the admin dashboard. If the
    passwords do not match, it sets `errMsg` to true and redirects to the admin login page. If the
    response is falsy, it sets `errMsg` to true and redirects to the admin login page. If there is
    an error, it logs the error to the console. */
    postLogin: (req, res, next) => {
        let adminData = req.body;
        try{
            loginHelper.postLogin(adminData).then((response) => {
                console.log('its response: ' + response);
                if(response){
                    if(response.password === adminData.password) {
                        req.session.admin = response;
                        res.redirect('/admin');
                    } else {
                        errMsg = true;
                        res.redirect('/admin/login');
                    }
                } else {
                    errMsg = true;
                    res.redirect('/admin/login');
                }
            })
        } catch (err) {
            console.log('post login error: ', err);
        }

    },


    /* `getLogout` is a function that handles the GET request for logging out of the admin panel. It
    sets the `admin` session to false and redirects to the admin dashboard. This effectively logs
    out the admin user and ends their session. */
    getLogout: (req, res, next) => {
        req.session.admin = false;
        res.redirect('/admin');
    },


    /* This function is handling the request for resetting the password for an admin user who has
    forgotten their password. It first gets the phone number of the admin user from the request body
    and then calls the `sendOtp` function from the `otpservice` module, passing in the `adminData`
    object. The `sendOtp` function returns a promise, which is handled using `.then()`. If the
    response is truthy, it logs the status of the response to the console and renders the
    `resetPassword` page with the appropriate variables passed in as an object. The `phoneNumber`
    variable is set to the phone number of the admin user, `admin` is set to true, and `notActive`
    is set to true. If there is an error, it logs the error to the console. */
    forgotPassword: (req, res, next) => {
        // loginHelper.getAdmin
        let adminData = { phone: '8848876169' }
        otpservice.sendOtp(adminData).then((response) => {
            console.log(response.status);
            res.render('admin/resetPassword', {phoneNumber: adminData.phone, admin:true, notActive: true})
        })
    },

    /* `resetPassword` is a function that handles the request for resetting the password for an admin
    user who has forgotten their password. It first gets the phone number, OTP, and new password of
    the admin user from the request body. It then calls the `verifyOtp` function from the
    `otpservice` module, passing in the `adminData` object. The `verifyOtp` function returns a
    promise, which is handled using `.then()`. If the response is truthy, it calls the
    `updatePassword` function from the `loginHelper` module, passing in the `adminData` object. The
    `updatePassword` function returns a promise, which is handled using `.then()`. If the response
    is truthy, it redirects to the admin dashboard. If the OTP is invalid, it renders the
    `resetPassword` page with the appropriate variables passed in as an object. The `phoneNumber`
    variable is set to the phone number of the admin user, `admin` is set to true, `notActive` is
    set to true, and `optMsg` is set to 'Invalid OTP'. If there is an error, it logs the error to
    the console. */
    resetPassword: (req, res, next) => {
        try{
            let adminData = { phone: '8848876169', otp: req.body.otp, password: req.body.password }
            otpservice.verifyOtp(adminData).then((result) => {
                console.log(result);
                if(result) {
                    loginHelper.updatePassword(adminData).then((result) => {
                        res.redirect('/admin');
                    })
                } else {
                    res.render('admin/resetPassword', {phoneNumber: phone, admin, notActive: true, optMsg: 'Invalid OTP'})
                }
            })
        } catch (er) {
            console.log('rest password error: ', er);
        }
    }


    

}