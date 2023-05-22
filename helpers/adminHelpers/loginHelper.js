const admin = require('../../models/admin-model');

module.exports = {


    postLogin: (adminData) => {
        return new Promise((resolve, reject) => {
            admin.findOne({username: adminData.username}).then((response) => {
                resolve(response);
            })
        })
    },

    updatePassword: (adminData) => {
        return new Promise((resolve, reject) => {
            admin.updateOne({phone: adminData.phone}, {$set: {password: adminData.password}}).then((response) => {
                resolve(response);
            })
        })
    }

}