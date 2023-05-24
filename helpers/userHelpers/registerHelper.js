const { response } = require('express');
const user = require('../../models/user-model');
const bcrypt = require('bcrypt');


module.exports = {

    /* This is a function called `doRegister` that takes in a parameter `userData`. It creates a new
    instance of the `user` model with the `userData` and saves it to the database. The function is
    marked as `async` which means it returns a promise that resolves to the result of the operation.
    If there is an error while registering the new user, it logs the error to the console. */
    doRegister: async(userData) => {
        try {
            let customer = new user(userData);
            await customer.save();
        } catch (err) {
            console.log('Error while registering new User'+err);
        }
    },


    /* `checkUser` is a function that takes in a parameter `userData` and checks if a user with the
    given phone number already exists in the database. It does this by using the `findOne` method of
    the `user` model to search for a user with the phone number in the `userData` parameter. If a
    user is found, it returns `true`, otherwise it returns `false`. The function is marked as
    `async` which means it returns a promise that resolves to the result of the operation. If there
    is an error while checking for the user, it logs the error to the console. */
    checkUser: async(userData) => {
        try{
            let customer = await user.findOne({phone: userData.phone});
            if(customer) {
                return true;
            } else {
                return false;
            }
        } catch (err) {
            console.log('Error while checking user'+err);
        }
    },


    /* This is a function called `updatePassword` that takes in a parameter `userData`. It updates the
    password of a user in the database by using the `updateOne` method of the `user` model to find
    the user with the phone number in the `userData` parameter and set their password to a hashed
    version of the new password provided in the `userData` parameter. The function returns a promise
    that resolves to the result of the operation. If there is an error while updating the password,
    it logs the error to the console. The password is hashed using the `bcrypt` library with a salt
    of 10. */
    updatePassword: (userData) => {
        try {
            return new Promise(async (resolve, reject) => {
                let password = await bcrypt.hash(userData.password, 10);
                user.updateOne({phone: userData.phone}, {$set:{password: password}}).then((response) => {
                        resolve(response);
                })
            })
        } catch (err) {
            console.log('Error while updating password: '+ err);
        }
    },


    checkEmailAddress: (email) => {
        return new Promise((resolve, reject) => {
            user.findOne({ email: email}).then((response) => {resolve(response)})
            .catch(err => console.log('Error while checking email availability', err))
        })
    }



}