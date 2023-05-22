const user = require('../../models/user-model');



module.exports = {

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