const bcrypt = require('bcrypt');
const session = require('express-session');
const loginHelper = require('../../helpers/userHelpers/userLoginHelper');


// additional variables
let errMsg = false;

//importing twilio functions
const otpController = require('./otpController');



let loginController = {

    

    /* This is a controller method for rendering the login page. It takes in the request, response, and
    next middleware function as parameters. Inside the method, it logs a message to the console,
    retrieves the `blocked` value from the session object, and renders the `shop/login` view with
    the `title`, `errMsg`, and `blocked` variables passed as parameters. It also resets the
    `errMsg`, `blocked`, and `err` values in the session object to `false`. If an error occurs, it
    logs the error to the console. */
    getLogin: (req, res, next) => {
        try{
                console.log('hello');
                let blocked = req.session.blocked;
                console.log(errMsg, blocked);
                res.render('shop/login', { title: 'Login', errMsg, blocked, loginPage:true})
                errMsg = false, req.session.blocked = false, req.session.err = false;
        } catch(err){
            console.log(err);
        }
    },
        

    /* This is a controller method for handling the login form submission. It takes in the request,
    response, and next middleware function as parameters. Inside the method, it retrieves the user
    data from the request body and passes it to the `doLogin` function in the `loginHelper` module.
    If the login is successful, it sets the `loggedIn` value in the session object to `true` and
    sets the `user` value in the session object to the user data returned by the `doLogin` function.
    It also sets the `activeStatus` value of the user to `true` using the `setActiveStatus` function
    in the `loginHelper` module. If the login is unsuccessful, it sets the `errMsg` value to `true`
    and redirects the user to the login page. */
    postLogin: async (req, res, next) => {
        let userData = req.body;
        loginHelper.doLogin(userData).then((response) => {
            if(response.status){
                req.session.loggedIn = true;
                let abc = response.user
                // req.session.user = response.user;
                req.session.user = {
                    _id: response.user._id,
                    name: response.user.name,
                    phone: response.user.phone,
                    password: response.user.password,
                    __v: response.user.__v,
                    email: response.user.email,
                    blocked: response.user.blocked,
                    activeStatus: response.user.activeStatus,
                    cartCount : response.userCart ? response.userCart.items.length : 0
                    
                };
                console.log(response.user)
                console.log('session user::', req.session.user);
                loginHelper.setActiveStatus(response.user, req.session.loggedIn);
                res.redirect('/');
            } else {
                errMsg = true;
                res.redirect('/login');
            }
        })
    },


    /* This is a controller method for handling the logout functionality. It takes in the request,
    response, and next middleware function as parameters. Inside the method, it sets the `loggedIn`
    value in the session object to `false`, retrieves the `user` value from the session object, sets
    the `activeStatus` value of the user to `false` using the `setActiveStatus` function in the
    `loginHelper` module, sets the `user` value in the session object to `null`, and redirects the
    user to the home page. */
    logout: (req, res, next) => {
        req.session.loggedIn = false;
        let user = req.session.user;
        loginHelper.setActiveStatus(user, req.session.loggedIn);
        req.session.user = null;
        res.redirect('/');
    },


    /* `otpLogin` is a controller method that handles the request for sending an OTP (One-Time
    Password) to the user's phone number for login verification. It takes in the request, response,
    and next middleware function as parameters. Inside the method, it retrieves the phone number
    from the query parameter of the request and passes it to the `otpLogin` function in the
    `loginHelper` module. If the phone number is not registered, it sends a JSON response with a
    message indicating that the phone number is not registered and a `valid` value of `false`. If
    the phone number is registered, it calls the `sendOtp` function in the `otpController` module to
    send an OTP to the user's phone number. If the OTP is sent successfully, it sends a JSON
    response with a `valid` value of `true`. If an error occurs, it logs the error to the console
    and sends a JSON response with a message indicating that something went wrong and a `valid`
    value of `false`. */
    otpLogin: (req, res, next) => {
        try{
            let userData = {
                phone: req.query.phone
            }
            loginHelper.otpLogin(userData.phone).then((user) => {
                if (!user) {
                    res.status(200).json({message: 'The Phone number is not registered', valid: false});
                } else {
                    otpController.sendOtp(userData).then(()=> {
                        res.status(200).json({valid: true});
                    }).catch(err => {
                        console.log('Error in controller of optLogin:', err);
                        res.status(200).json({valid: false, message: 'Somethings wrong'});
                    })
                }
            })
        } catch (err) {
            console.log('Error (outside) in controller of optLogin:', err);
        }
    },


    /* `verifyOtpLogin` is a controller method that handles the verification of OTP (One-Time Password)
    for login. It takes in the request, response, and next middleware function as parameters. Inside
    the method, it retrieves the phone number and OTP from the request body and passes it to the
    `verifyOtp` function in the `otpController` module. If the OTP is verified successfully, it
    calls the `loginUserByOtp` function in the `loginHelper` module to log in the user. If the login
    is successful, it sets the `loggedIn` value in the session object to `true` and sets the `user`
    value in the session object to the user data returned by the `loginUserByOtp` function. It also
    sends a JSON response with a `valid` value of `true`. If the OTP is invalid, it sends a JSON
    response with a message indicating that the OTP is invalid and a `valid` value of `false`. If an
    error occurs, it logs the error to the console and sends a JSON response with a message
    indicating that something went wrong and a `valid` value of `false`. */
    verifyOtpLogin: (req, res, next) => {
        let userData = {
            phone: req.body.phone,
            otp: req.body.otp
        }
        otpController.verifyOtp(userData).then((result) => {
            if (result) {
                loginHelper.loginUserByOtp(userData.phone).then((response) => {
                    if(response.status){
                        req.session.user = {
                            _id: response.user._id,
                            name: response.user.name,
                            phone: response.user.phone,
                            password: response.user.password,
                            __v: response.user.__v,
                            email: response.user.email,
                            blocked: response.user.blocked,
                            activeStatus: response.user.activeStatus,
                            cartCount : response.userCart ? response.userCart.items.length : 0
                        };
                        req.session.loggedIn = true;

                        res.status(200).json({valid: true});
                    } else {
                        res.status(200).json({valid: false, message: 'Somethings wrong in server side'});
                    }
                })
            } else {
                res.status(200).json({valid: false, message: 'Invalid OTP'});
            }
        })
    }

}



module.exports = loginController;