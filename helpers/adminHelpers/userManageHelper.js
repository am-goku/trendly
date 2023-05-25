const user = require('../../models/user-model');



module.exports = {

    /* This is a function called `checkBlockStatus` that takes an `id` parameter. It uses the
    `async/await` syntax to query the database for a user with the given `id` using the `findOne`
    method from the `user` model. If the user is found and their `blocked` property is `true`, the
    function updates the user's `blocked` property to `false` using the `updateOne` method and
    returns a promise that resolves with the response from the database. If the user is found and
    their `blocked` property is `false`, the function updates the user's `blocked` property to
    `true` and returns a promise that resolves with the response from the database. If an error
    occurs during the database operation, the function logs the error message to the console. */
    checkBlockStatus: async (id) => {
        try {
            let customer = await user.findOne({ _id: (id) });
            if (customer.blocked) {
                return new Promise(async (resolve, reject) => {
                    await user.updateOne({ _id: (id) }, { $set: { blocked: false } }).then((response) => {
                        resolve(response);
                    })
                })
            } else {
                return new Promise(async (resolve, reject) => {
                    await user.updateOne({ _id: (id) }, { $set: { blocked: true } }).then((response) => {
                        resolve(response);
                    })
                })
            }
        } catch (err) {
            console.log(err.message);
        }
    },



}