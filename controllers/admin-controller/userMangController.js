const userHelper = require('../../helpers/userHelpers/userHelper');
const userManagementHelper = require('../../helpers/adminHelpers/UserManagementHelper');

// aditional variables
const admin = true, title = 'Admin Panel';

module.exports = {
    editUser: async (req, res, next) => {
        let id = req.params.id;
        console.log('id: ' + id);
        await userHelper.findUserById(id).then((customer) => {
            console.log(customer);
            res.render('admin/editUser', {admin, title, customer});
        })
    },

    updateUser: async (req, res, next) => {
        let userData = req.body;
        let id = req.params.id;
        await userHelper.updateUserById(userData,id).then((result) => {
            if(result){
                res.redirect('/admin/customers');
            } else {
                console.log('error:'+result);
            }
        })
    },


    blockUnblockUser: async (req, res, next) => {
        let id = req.query.id;
        await userManagementHelper.checkBlockStatus(id). then((result) => {
            if(result){
                console.log('block status: '+ result.blocked);
                res.redirect('/admin/customers');
            }
        })
    }
}