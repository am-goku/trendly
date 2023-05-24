const admin = require('../../models/admin-model');

module.exports = {


    /* This is a function called `postLogin` that takes in an object `adminData` as a parameter. It
    returns a Promise that resolves with the result of a `findOne` query on the `admin` model,
    searching for an admin with the `username` property matching the `username` property of the
    `adminData` object. The `response` from the query is passed as the resolved value of the
    Promise. */
    postLogin: (adminData) => {
        return new Promise((resolve, reject) => {
            admin.findOne({ username: adminData.username }).then((response) => {
                resolve(response);
            })
        })
    },

    /* This is a function called `updatePassword` that takes in an object `adminData` as a parameter.
    It returns a Promise that resolves with the result of an `updateOne` query on the `admin` model,
    updating the `password` property of the admin with the `phone` property matching the `phone`
    property of the `adminData` object. The `response` from the query is passed as the resolved
    value of the Promise. */
    updatePassword: (adminData) => {
        return new Promise((resolve, reject) => {
            admin.updateOne({phone: adminData.phone}, {$set: {password: adminData.password}}).then((response) => {
                resolve(response);
            })
        })
    }

}