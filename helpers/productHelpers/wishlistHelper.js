//importing models
const wishlist = require('../../models/wishlist-model');
const customer = require('../../models/user-model');
const product = require('../../models/product-model');


module.exports = {
    addToWishlist: async (productId, userId) => {
        try{

            const user = await customer.findOne({_id: userId});
            const item = await product.findOne({_id: productId});
            const userWishlist = await wishlist.findOne({user: userId});

            return new Promise((resolve, reject)=> {
                if(userWishlist){
                    wishlist.updateOne({user: userId}, {$push: {items: {product: productId}}}).then((response)=> {
                        resolve(response);
                    }).catch((err)=> {
                        console.log('Eror inside add to whishlist helper-1', err);
                    })
                } else {
                    wishlist.create({user: userId, items: [{product: productId}]}).then((response)=> {
                        resolve(response);
                    }).catch((err)=> {
                        console.log('Eror inside add to whishlist helper-2', err);
                    })
                }
            })


        } catch(err) {
            console.log('error outside adding wishlist in helper', err);
        }
    },


    getWishlist: (userId) => {
        try {
            return new Promise((resolve, reject)=> {
                wishlist.findOne({user: userId}).populate('items.product').lean().then((list) => {
                    console.log(list);
                    if(list){
                        resolve({status: true, list: list});
                    } else {
                        resolve({status: false})
                    }
                }).catch((err) => {
                    console.log('Error inside helper of get wishlist', err);
                })
            })
        } catch(err) {
            console.log('Error ouside helper of get wishlist', err);
        }
    },


    removeFromWishlist: (userId, productId) => {
        try{

            return new Promise((resolve, reject) => {
                wishlist.updateOne({user: userId}, {$pull: {items: {product: productId}}}).then((response)=> {
                    resolve(response);
                }).catch((err)=> {
                    console.log('Error inside removing item from wishlist', err);
                })
            })

        } catch (err) {
            console.log('Error outside removing item from wishlist', err);
        }
    }
}