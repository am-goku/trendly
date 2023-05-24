const profileHelper = require('../../helpers/userHelpers/profileHelper');
const userHelper = require('../../helpers/userHelpers/userHelper');



module.exports = {
    /* `updateProfile` is a function that handles a POST request to update a user's profile. It takes
    in the request (`req`), response (`res`), and next middleware function (`next`) as parameters.
    It first extracts the `userId` from the user session, the `newData` from the request body, and
    the `image` from the request file. It then calls the `updateProfile` function from the
    `profileHelper` module, passing in the `userId`, `newData`, and `image` as arguments. Once the
    profile is successfully updated, it updates the user session with the new image filename and
    redirects the user to the profile page. */
    updateProfile: (req, res, next) => {
        let userId = req.session.user._id;
        let newData = req.body;
        let image = req.file;
        profileHelper.updateProfile(userId, newData, image).then((response) => {
            req.session.user.image = image.filename;
            res.redirect('/profile');
        })
    },


    /* `addAddress` is a function that handles a POST request to add a new address to a user's list of
    addresses. It extracts the address data from the request body and the user ID from the user
    session. It then calls the `addAddress` function from the `userHelper` module, passing in the
    user ID and address data as arguments. Once the address is successfully added, it updates the
    user session with the new address and redirects the user to the profile page. */
    addAddress: (req, res, next) => {
        let address = req.body;
        userHelper.addAddress(req.session.user._id, address).then((response) => {
            console.log(response);
            req.session.user.address = response;
            console.log('user address: ', req.session.user);
            res.redirect('/profile');
        })
    },

    /* `deleteAddress` is a function that handles a DELETE request to delete an address from a user's
    list of addresses. It takes in the request (`req`), response (`res`), and next middleware
    function (`next`) as parameters. It first extracts the `id` of the address to be deleted from
    the request parameters and the `userId` from the user session. It then calls the `deleteAddress`
    function from the `userHelper` module, passing in the `id` and `userId` as arguments. Once the
    address is successfully deleted, it redirects the user to the profile page. */
    deleteAddress: (req, res, next) => {
        let id = req.params.id;
        let userId = req.session.user._id;
        userHelper.deleteAddress(id, userId).then((response) => {
            console.log('delete response'+response);
            res.redirect('/profile');
        })
    },

    /* `getAnAddress` is a function that handles a GET request to retrieve a single address from a
    user's list of addresses. It takes in the request (`req`), response (`res`), and next middleware
    function (`next`) as parameters. */
    getAnAddrress: (req, res, next) => {
        try{
            let addressId = req.body.addressId;
            let userId = req.session.user._id;
            let address;
            userHelper.getAddress(userId).then((response) => {
                let addressList = response.address;
                console.log(addressList);
                for(let i=0; i<addressList.length; i++) {
                    if(addressList[i]._id == addressId) {
                        address = addressList[i];
                        break;
                    }
                }
                console.log('single adddress::', address);
                res.status(200).json(address);
            })
        } catch (err) {
            console.log('Error getting single address ::', err);
        }
    }

    

}