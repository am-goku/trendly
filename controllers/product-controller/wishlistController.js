//importing helpers
const wishlistHelper = require('../../helpers/productHelpers/wishlistHelper');



module.exports = {
    getWishlist: (req, res, next)=> {
        const userId = req.session.user._id;
        wishlistHelper.getWishlist(userId).then((response) => {
            if(response.status) {
                const wishlist = response.list;
                if(wishlist.items.length){
                    res.render('shop/wishlist', {customer: req.session.user, wishlist, products: wishlist.items})
                } else {
                    res.render('shop/wishlist', {customer: req.session.user, wishlist, emptyList:true, products: wishlist.items})
                }
            } else {
                res.render('shop/wishlist', {customer: req.session.user, wishlist: false})
            }
        }).catch((err) => {
            console.log('something wrong in getwilist controller', err);
            res.redirect('/');
        })
    },


    addToWhishlist: (req, res) => {
        const userId = req.session.user._id;
        const productId = req.body.productId;

        wishlistHelper.addToWishlist(productId, userId)
        .then((response)=> {
            if(response.status){
                res.status(200).json({status: true})
            } else {
                res.status(200).json({status: false})
            }
        }).catch((error)=> {
            console.log('error in addto whislist controller-1', error);
            res.status(200).json({status: false})
        })

    },

    removeFromWishlist: (req, res, next)=> {
        const userId = req.session.user._id;
        const productId = req.body.productId;

        wishlistHelper.removeFromWishlist(userId, productId).then((response)=> {
            if(response){
                res.status(200).json({status:true});
            } else {
                res.status(200).json({status:false})
            }
        }).catch((err)=> {
            console.log('Error in removing wishlist in controller', err);
            res.redirect('/');
        })
        
    }


}