const { response } = require('express');
const cartHelper = require('../../helpers/productHelpers/cartHelper');
const user = require('../../models/user-model');
const couponManagement = require('../user-controller/couponManagemet');

const cartController = {


// Its the function to add items to cart, this function calls another function from the cartHelper that in productHelpers,
// and this function does not give any response to the client cause this function only add the products to cart and
// updates the cart collection in the database.
    addtoCart: (req, res, next) => {
        // let data = JSON.parse(req.query.data);
        let productId = req.body.productId;
        let quantity = req.body.quantity;
        let customer = req.session.user;
        let color = req.body.color;
        let size = req.body.size;

        if (customer) {
            console.log(customer);
            cartHelper.addtoCart(customer, productId, quantity, color, size).then((cart) => {
                req.session.user.cart = cart;
                req.session.user.cartCount += 1;
                console.log(req.session.user.cartCount,'cart is: ', req.session.user);
            })

        } else {
            console.log('no user');
        }
    },


// Its the function that used to show the cart, which means this function calls another function from the cartHelper in productHelpers,
// from the showCart function we get a response containing the user's cart details with items and its quantity, after that
// this function sends the respose to the front end to give a reponse to the client by rendering the cart page in shop.
    showCart: (req, res, next) => {
        try{
            let customer = req.session.user;
            cartHelper.showCart(customer).then(async (cart) => {
                if(cart && cart.items.length > 0){
                    let products = cart.items, total = [], subtotal = 0;

                    for (let i=0; i<products.length; i++) {
                        products[i].amount = products[i].product.productPrice * products[i].quantity;
                    }//to find total product price.
                    for (let i = 0; i < products.length; i++) {
                        subtotal += products[i].amount;
                    }
                    console.log(products);

                    let coupons = await couponManagement.getActiveCoupons();

                    res.render('shop/cart', { customer, products, cart, subtotal, cartActive:true, coupons });
                } else {
                    res.render('shop/cart', { cart, emptyCart:true, cartActive: true, customer })
                }
            });
        } catch (err) {
            console.log('Error while showing cart: '+ err);
        }
    },


// This is a function which helps to add the quantity of a product in the cart by calling another function addQuantity in cartHelper.
    addQuantity: (req, res, next) => {
        let itemId = req.query.itemId;
        let userId = req.session.user._id;
        let productId = req.body.productId;
        cartHelper.addQuantity(itemId, userId, productId).then((cart) => {
            console.log('hii',cart);
            res.status(200).json({cart});
        }).catch((err) => {
            console.log('the error occurred: '+ err);
        })
    },

// This is a function which helps to reduce the quantity of a product in the cart by calling another function reduceQuantity in cartHelper.
    reduceQuantity: (req, res, next) => {
        let itemId = req.query.itemId;
        let userId = req.session.user._id;
        let productId = req.body.productId;
        cartHelper.reduceQuantity(itemId, userId, productId).then((cart) => {
            console.log(cart);
            res.status(200).json({cart: cart});
        }).catch((err) => {
            console.log('the error occurred: '+ err);
        })
    },



    /* `removeItem` is a function in the `cartController` object that is used to remove an item from
    the user's cart. It takes in the `req`, `res`, and `next` parameters. It first gets the `userId`
    from the `req.session.user._id` and the `itemId` from the `req.params.id`. It then calls the
    `removeItem` function from the `cartHelper` module, passing in the `userId` and `itemId`. Once
    the item is removed from the cart, it redirects the user to the cart page using
    `res.redirect('/cart')`. */
    removeItem: (req, res, next) => {
        let userId = req.session.user._id
        let itemId = req.params.id;
        cartHelper.removeItem(userId, itemId).then((response) => {
            console.log(response)
            res.redirect('/cart')

        })  
    },


    /* `checkProduct` is a function in the `cartController` object that is used to check if a product
    is already in the user's cart. It takes in the `req`, `res`, and `next` parameters. It first
    gets the `userId` from the `req.session.user._id`. If there is no user session, it sends a
    response with `productInCart` set to `false`. It then gets the `productDetails` from the
    `req.body`. It calls the `checkProduct` function from the `cartHelper` module, passing in the
    `userId` and `productDetails`. Once the product is checked, it sends a response with
    `productInCart` set to `true` if the product is already in the cart, or logs a message to the
    console if the product is not in the cart. */
    checkProduct: (req, res, next) => {
        let userId = req.session.user._id;

        if(req.session.user) {
            userId = req.session.user._id;
        } else {
            res.status(200).json({productInCart:false});
        }

        let productDetails = req.body;

        cartHelper.checkProduct(userId, productDetails).then((response) => {
            console.log(response);
            if(response) {
                res.status(200).json({productInCart:response})
            } else {
                console.log('product is available to add to cart');
            }
        })
    }

}


module.exports = cartController;