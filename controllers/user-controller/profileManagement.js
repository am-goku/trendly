const profileHelper = require('../../helpers/userHelpers/profileHelper');
const userHelper = require('../../helpers/userHelpers/userHelper');







module.exports = {
    updateProfile: (req, res, next) => {
        let userId = req.session.user._id;
        let newData = req.body;
        let image = req.file;
        profileHelper.updateProfile(userId, newData, image).then((response) => {
            req.session.user.image = image.filename;
            res.redirect('/profile');
        })
    },


    addAddress: (req, res, next) => {
        let address = req.body;
        userHelper.addAddress(req.session.user._id, address).then((response) => {
            console.log(response);
            req.session.user.address = response;
            console.log('user address: ', req.session.user);
            res.redirect('/profile');
        })
    },

    deleteAddress: (req, res, next) => {
        let id = req.params.id;
        let userId = req.session.user._id;
        userHelper.deleteAddress(id, userId).then((response) => {
            console.log('delete response'+response);
            res.redirect('/profile');
        })
    },

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