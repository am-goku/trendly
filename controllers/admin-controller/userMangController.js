const userHelper = require('../../helpers/userHelpers/userHelper');
const userManagementHelper = require('../../helpers/adminHelpers/UserManagementHelper');

// aditional variables
const admin = true, title = 'Admin Panel';

module.exports = {
    /* This is a function that handles a GET request to edit a user's information. It retrieves the
    user's ID from the request parameters, uses the `userHelper` module to find the user by ID, and
    then renders the `admin/editUser` view with the retrieved user's information. The `admin` and
    `title` variables are also passed to the view. The function is asynchronous and uses `await` to
    wait for the `findUserById` promise to resolve before rendering the view. */
    editUser: async (req, res, next) => {
        let id = req.params.id;
        console.log('id: ' + id);
        await userHelper.findUserById(id).then((customer) => {
            console.log(customer);
            res.render('admin/editUser', {admin, title, customer});
        })
    },

    /* This is a function that handles a POST request to update a user's information. It retrieves the
    user's ID from the request parameters and the updated user data from the request body. It then
    uses the `userHelper` module to update the user's information by ID and redirects the user to
    the `/admin/customers` page. If there is an error during the update process, it logs the error
    to the console. The function is asynchronous and uses `await` to wait for the `updateUserById`
    promise to resolve before redirecting the user. */
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


    /* `blockUnblockUser` is a function that handles a GET request to block or unblock a user. It
    retrieves the user's ID from the request query parameters and uses the `userManagementHelper`
    module to check the block status of the user by ID. If the user is blocked, it logs the block
    status to the console and redirects the user to the `/admin/customers` page. The function is
    asynchronous and uses `await` to wait for the `checkBlockStatus` promise to resolve before
    redirecting the user. */
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