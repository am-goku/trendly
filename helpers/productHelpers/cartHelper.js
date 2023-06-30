const { error } = require('jquery');
const cart = require('../../models/cart-model');
const product = require('../../models/product-model');
const user = require('../../models/user-model');





const cartHelper = {

// This is a database helper fucntion which contains three parameters user, productId and quantity to create a new cart or,
// add an item to the cart. this function contais a promise function which updates or create a cart collection then retures
// a response. the response contains the cart collection.
    addtoCart: (user, productId, quantity, color, size)=>{
        try{
            return new Promise(async (resolve, reject) => {
                const userId = user._id;
                let totalAmount =0;
                const activeCart = await cart.findOne({userId: userId}).populate('items.product');
                if(activeCart){
                    let prdct = await product.findOne({_id: productId});
                    let productTotal = prdct.productPrice * quantity;
                    cart.updateOne({userId: userId},{$push:{items:{product: productId, quantity: quantity, productTotal: productTotal, color: color, size: size}}}).then((response)=> {
                        cart.findOne({userId: userId}).populate('items.product').then((response)=> {
                            for(let i = 0; i < response.items.length; i++){
                                totalAmount += (response.items[i].product.productPrice * response.items[i].quantity);
                            }
                            cart.updateOne({userId: userId},{$set: {totalAmount: totalAmount}}).populate('items.product').then((cart)=>{
                                resolve(cart);
                            })
                                
                        })
                    });
                } else {
                    const prdct = await product.findOne({_id: productId});
                    const productTotal = prdct.productPrice * quantity;
                    cart.create({userId: userId, items:[{product: productId, quantity: quantity, productTotal: productTotal, color: color, size: size}]}).then((response)=> {
                        cart.findOne({userId: userId}).populate('items.product').then((response)=> {
                            for(let i = 0; i < response.items.length; i++){
                                totalAmount += (response.items[i].product.productPrice * response.items[i].quantity);
                            }
                            cart.updateOne({userId: userId},{$set: {totalAmount: totalAmount}}).populate('items.product').then((cart)=>{
                                resolve(cart);
                            })
                        })
                    });
                }
            })
        } catch(err) {
            console.log('Error while adding to cart: '+ err);
        }
    },




// This showCart function is a function which contains a promise function which finds a particular data from the cart collection,
// using user details or userId. after that it returns a response which contains that particular document from that collection.
    showCart: (user) => {
        try{
            return new Promise((resolve, reject) => {
                const userId = user._id;
                cart.findOne({userId: userId}).populate('items.product').lean().exec().then((response)=> {
                    console.log(response);
                    resolve(response);
                })
            })
        } catch (err) {
            console.log('Error while fetching cart datas: '+ err);
        }
    },

//this is a function which ADDs the quantity of a product in a document from cart collection using userId and productId.
    addQuantity: (itemId, userId, productId) => {
        try{
            return new Promise(async (resolve, reject) => {
                let totalAmount =0;
                const prdct = await product.findOne({_id: productId});
                cart.findOneAndUpdate({userId: userId, 'items._id': itemId}, {$inc:{'items.$.quantity': 1, 'items.$.productTotal': prdct.productPrice}}).populate('items.product').then((response)=>{
                    cart.findOne({userId: userId}).populate('items.product').then((result) => {
                        for(let i = 0; i < result.items.length; i++){
                            totalAmount += (result.items[i].product.productPrice * result.items[i].quantity);
                        }
                        cart.updateOne({userId: userId},{$set: {totalAmount: totalAmount}}).populate('items.product').then((userCart)=>{
                            cart.findOne({userId: userId}).populate('items.product').then((productCart)=>{
                                resolve(productCart);
                            })
                        })
                    })
                    // resolve(response);
                }).catch((error)=>{
                    console.log('the error is : ' + error.message);
                })
            })
        } catch(err) {
            console.log('Error while adding quantity in cart: '+ err);
        }
        
    },

//this is a function which REDUCE the quantity of a product in a document from cart collection using userId and productId.
    reduceQuantity: (itemId, userId, productId) => {
        try{
            return new Promise(async (resolve, reject) => {
                let totalAmount=0;
                const prdct = await product.findOne({_id: productId});
                cart.findOneAndUpdate({userId: userId, 'items._id': itemId}, {$inc:{'items.$.quantity': -1, 'items.$.productTotal': -prdct.productPrice}}).populate('items.product').then((response)=>{
                    cart.findOne({userId: userId}).populate('items.product').then((result) => {
                        for(let i = 0; i < result.items.length; i++){
                            totalAmount += (result.items[i].product.productPrice * result.items[i].quantity);
                        }
                        cart.updateOne({userId: userId},{$set: {totalAmount: totalAmount}}).populate('items.product').then((userCart)=>{
                            cart.findOne({userId: userId}).populate('items.product').then((productCart)=>{
                                resolve(productCart);
                            })
                        })
                    })
                    // resolve(response);
                }).catch((error)=>{
                    console.log('ther error is : ' + error.message);
                })
            })
        } catch(err) {
            console.log('Error while reducing quantity in cart: '+ err);
        }
    },


    /* This is a function in a cartHelper object that removes an item from the cart collection based on
    the userId and itemId provided. It uses the findOneAndUpdate method to find the cart document
    with the given userId and then removes the item with the given itemId using the  operator.
    It returns a promise that resolves with the updated cart document after the item has been
    removed. */
    removeItem: (userId, itemId) => {
        return new Promise((resolve, reject) => {
            cart.findOneAndUpdate({userId: userId}, {$pull: {items: {_id: itemId}}}).then((res)=> {
                console.log('from helper: ' + res);
                cart.findOne({userId: userId}).lean().then((response)=> {
                    resolve (response);
                })
            })
        })
    },


    /* `checkProduct` is a function in the `cartHelper` object that checks if a given product with
    specific variants (size and color) is already present in the user's cart or not. It takes two
    parameters, `userId` and `productDetails` (an object containing `productId`, `size`, and
    `color`). */
    checkProduct: (userId, productDetails) => {
        try {

            return new Promise((resolve, reject) => {
                let flag = false;
                cart.findOne({userId: userId}).then((userCart) => {
                    const product = userCart?.items;
                    //checking the given product is in the cart with the same varients or not;
                        if(product){
                            for(let i=0; i<product.length; i++) {
                                if(product[i].product == productDetails.productId) {
                                    if(product[i].size === productDetails.size && product[i].color === productDetails.color){
                                        flag = true;
                                        break;
                                    }
                                }
                            }
                        }
                        resolve(flag);
                }).catch((err) => {
                    console.log('Error in checking product', err);
                })
            })

        } catch (err) {
            console.log('error checking the product availability in cart: ', err);
        }
    }

}



module.exports = cartHelper;