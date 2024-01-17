const customer = require('../../models/user-model');
const registerHelper = require('../../helpers/userHelpers/registerHelper');
const bcrypt = require('bcrypt');
const session = require('express-session');
const otpController = require('./otpController');

// additional resources:
let title = 'Register';
let regUser = false;
let phoneNumber = null;
let otpValid = false;



module.exports = {

    /* This is a controller method that handles the GET request for the registration page. It checks if
    the user is already logged in, and if so, redirects them to the home page. If the `otpValid`
    flag is true, it renders the registration page with the `title` and `phoneNumber` variables
    passed as parameters and resets the `otpValid` flag and `phoneNumber` variable. If the
    `otpValid` flag is false, it redirects the user to the phone number form for registration. */
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

    /* This is a controller method that handles the submission of the registration form. It takes in a
    request and response object as parameters, extracts the user data from the request body, hashes
    the password using bcrypt, and passes the user data to a helper method called `doRegister` which
    saves the user data to the database. Finally, it redirects the user to the login page. The
    `async` keyword is used to indicate that the function contains asynchronous code and may use the
    `await` keyword to wait for promises to resolve. */
    postRegister: async (req, res, next) => {
        const userData = req.body;
        userData.password = await bcrypt.hash(userData.password, 10);
        await registerHelper.doRegister(userData);
        res.redirect('/login');

    },


    /* This is a controller method that renders the phone number form during the registration process.
    It checks if the user is already logged in, and if so, redirects them to the home page. If the
    user is not logged in, it renders the phone number form with the `title` and `regUser` variables
    passed as parameters. The `regUser` variable is set to false initially, but may be set to true
    if the user is already registered and the phone number form needs to be rendered again with an
    error message. */
    getPhoneNumer: (req, res, next) => {
        if (req.session.loggedIn) {
            res.redirect('/');
        } else {
            res.render('shop/get-phone', { title, regUser });
            regUser = false;
        }
    },

    /* This is a controller method that handles the submission of the phone number form during the
    registration process. It takes in a request and response object as parameters, extracts the user
    data from the request body, and passes it to a helper method called `checkUser` which returns a
    promise. The promise is resolved with a boolean value indicating whether the user is already
    registered or not. Based on the response, the controller method either renders the OTP form with
    the phone number or redirects the user to the phone number form again with an error message. If
    the user is not already registered, the phone number is stored in a variable called
    `phoneNumber` and an OTP is sent to the user's phone number using the `sendOtp` method from the
    `otpController`. The OTP form is then rendered with the phone number passed as a parameter. If
    the user is already registered, the controller method redirects the user to the phone number
    form again with an error message. */
    postPhoneNumber: async (req, res, next) => {

        const userData = req.body;
        regUser = await registerHelper.checkUser(userData);
        if(!regUser){
            phoneNumber = userData.phone;
            otpController.sendOtp(userData).then((response) => {
                res.render('shop/otp-form', {title, phoneNumber});
            }).catch((err)=> {
                res.redirect('/register/phone');
            })
        } else {
            res.redirect('/register/phone');
        }

    },

    /* `otpVerification` is a controller method that handles the verification of the OTP (One-Time
    Password) entered by the user. It takes in a request and response object as parameters, extracts
    the OTP from the request body, and passes it to a helper method called `verifyOtp` which returns
    a promise. The promise is resolved with a boolean value indicating whether the OTP is valid or
    not. Based on the response, the controller method sets the `otpValid` flag to true or false and
    redirects the user to the registration page or renders the OTP form again with an error message. */
    otpVerification: (req, res) => {
        const userData = req.body;
        otpController.verifyOtp(userData).then((status) => {
            console.log(status);
            if(status) {
                otpValid = true;
                res.redirect('/register');
            } else {
                res.render('shop/otp-form', {title, otpMsg: 'Invalid Otp', phoneNumber});
            }
        }).catch((err) => {
            res.render('shop/otp-form', {title, otpMsg: 'Internal server error', phoneNumber});
        })
    },


    /* This is a controller method that checks if an email address is already registered in the system.
    It takes in a request and response object as parameters, extracts the email from the request
    body, and passes it to a helper method called `checkEmailAddress` which returns a promise. The
    promise is resolved with a boolean value indicating whether the email is already registered or
    not. Based on the response, the controller method sends a JSON response to the client with a
    message and availability status. If the email is already registered, the message will indicate
    that and the availability status will be false. Otherwise, the availability status will be true. */
    checkEmail: (req, res) => {
        const email = req.body.email;
        registerHelper.checkEmailAddress(email).then((response) => {
            console.log(response);
            if(response) {
                res.status(200).json({message: 'Email is alredy registered', availability: false});
            } else {
                res.status(200).json({availability: true});
            }
        })
    }




}