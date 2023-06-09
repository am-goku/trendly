const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const emailValidator = require('email-validator');


//importing models
const cartCollection = require('../../models/cart-model');
const customer = require('../../models/user-model');








module.exports = {

    /* This is a function called `doLogin` that takes in a parameter `userData`. It is an asynchronous
    function that returns a Promise. */
    doLogin: async (userData) => {
        try{
            return new Promise(async (resolve, reject) => {
                let loginStatus = false;
                let response = {}, user;
                              
                if(emailValidator.validate(userData.phone)) {
                    user = await customer.findOne({ email: userData.phone });
                } else {
                    console.log('its error in login');
                    user = await customer.findOne({ phone: userData.phone });
                }
                if (user) {
                    bcrypt.compare(userData.password, user.password).then(async (status) => {
                        if (status) {
                            let userCart = await cartCollection.findOne({userId: user._id});
                            if(userCart){
                                response.userCart = userCart;
                            }
                            console.log('success');
                            response.user = user;
                            response.status = true;
                            resolve(response);
                        } else {
                            console.log('failed-1');
                            response.status = false;
                            resolve(response);
                        }
                    })
                } else {
                    console.log('failed');
                    response.status = false;
                    resolve(response);
                }
            })
        } catch (err) {
            console.log('Error while user Login: '+err);
        }
    },


    /* `setActiveStatus` is a function that takes in two parameters: `user` and `loggedIn`. It is an
    asynchronous function that updates the `activeStatus` field of a user in the database based on
    the `loggedIn` parameter. If `loggedIn` is true, it sets the `activeStatus` to true, otherwise
    it sets it to false. The function uses the `updateOne` method of the `customer` model to update
    the user's `activeStatus` field in the database. If there is an error while updating the user's
    `activeStatus`, the function logs an error message to the console. */
    setActiveStatus: async(user, loggedIn) => {
        try {
            console.log(user);
            if(loggedIn){
                await customer.updateOne({_id: user._id}, {$set: {activeStatus: true}});
                return;
            } else {
                await customer.updateOne({_id: user._id}, {$set: {activeStatus: false}});
                return;
            }
        } catch (err) {
            console.log('Error while setting Active status of the user: '+ err);
        }
    },


    /* `otpLogin` is a function that takes in a `phone` parameter. It returns a Promise that resolves
    to a user object if a user with the given phone number is found in the `customer` collection in
    the database. If there is an error while finding the user, the function logs an error message to
    the console. */
    otpLogin: (phone) => {
        try {
            return new Promise((resolve, reject) => {
                customer.findOne({phone: phone}).then((user) => {
                    resolve(user);
                }).catch((err) => {
                    console.log('Error in helper while otp login inside promise: '+ err);
                })
            })
        } catch (err) {
            console.log('Error in helper while otp login: '+ err);
        }
    },


    /* `loginUserByOtp` is a function that takes in a `phone` parameter. It is an asynchronous function
    that returns a Promise. The function first finds a user with the given phone number in the
    `customer` collection in the database using the `findOne` method of the `customer` model. It
    then returns a Promise that resolves to an object containing the user and their cart details if
    the user is found. If there is an error while finding the user or their cart details, the
    function logs an error message to the console and resolves the Promise with a status of false. */
    loginUserByOtp: async (phone) => {
        try{
            const response = {};
            const user = await customer.findOne({phone: phone});
            return new Promise((resolve, reject) => {
                cartCollection.findOne({userId: user._id}).then((userCart) => {
                    if(userCart){
                        response.userCart = userCart;
                    }
                    response.user = user;
                    response.status = true;
                    resolve(response);
                }).catch((err) => {
                    response.status = false;
                    resolve(response);
                    console.log("error in helper (inside return) while getting user after otp verified: ", err);
                })
            })
        } catch (err) {
            console.log("error in helper while getting user after otp verified: ", err);
        }
    }

}