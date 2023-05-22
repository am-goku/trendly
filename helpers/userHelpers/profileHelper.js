
const { response } = require('express');
let user = require('../../models/user-model');

const bcrypt = require('bcrypt');




module.exports = {

    /* This is a function called `updateProfile` that takes in three parameters: `userId`, `newData`,
    and `image`. It updates the user's profile information (name, email, and image) in the database
    using the `user.updateOne()` method. It returns a promise that resolves with the response from
    the database if the update is successful, or rejects with an error if there is an issue with the
    update. If there is an error outside of the promise, it is caught and logged to the console. */
    updateProfile: (userId, newData, image) => {
        try{
            return new Promise((resolve, reject) => {
                user.updateOne({_id: userId}, {$set: {name: newData.name, email: newData.email, image: image.filename }})
                .then((response) => {
                    resolve(response);
                }).catch((err) => {
                    console.log('Error updating profile: ' + err);
                    reject(err);
                })
            })
        } catch (err) {
            console.log('Error while updating user profile: ' + err);
        }
    },


    
}