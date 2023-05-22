//razorpay
const Razorpay = require('razorpay');
var instance = new Razorpay({
    key_id: 'rzp_test_MTk5iQyefsRP1C',
    key_secret: 'hf5Qd4kFrM02pR2FuwbCL2eG',
  });



//import models
const shopping_cart = require('../../models/cart-model');

const order = require('../../models/order-model');

// 6823



const paymentHelper = {

    /* The `completeOrder` function is a helper function that takes in three parameters: `userId`,
    `address`, and `paymentMethod`. */
    completeOrder: async (userId, address, paymentMethod) => {
        const cart = await shopping_cart.findOne({userId: userId}).populate('items.product');
        let totalAmount = 0, date = Date.now();

        //loop to calculate the total amount;
            for(let i=0; i<cart.items.length; i++) {
                totalAmount += (cart.items[i].product.productPrice * cart.items[i].quantity);
            }

        //getting order collection
            let orderCollection = await order.findOne({userId: userId});

        //updating or creating order
            return new Promise((resolve, reject) => {
                if(orderCollection){
                    order.updateOne({userId: userId}, {$push: {order: {products: cart.items, totalAmount: totalAmount, userId: userId, date: date, paymentMethod: paymentMethod, address: {address}}}})
                    .then((response) => {
                        order.findOne({userId: userId}).populate('order.products.product').then((res) => {
                            resolve(res);
                        })
                    })
                } else {
                    order.create({userId: userId, order:[{products: cart.items, totalAmount: totalAmount, userId: userId, date: date, paymentMethod: paymentMethod, address: {address}}]})
                    .then((response) => {
                        order.findOne({userId: userId}).populate('order.products.product').then((res) => {
                            resolve(res);
                        })
                    })
                }
            })
    },


    /* `generateRazorpay` is a function that takes in two parameters: `orderId` and `total`. It creates
    a new Promise and returns it. Inside the Promise, it uses the `instance` of the Razorpay API to
    create a new order with the specified `amount`, `currency`, `receipt`, and `notes`. Once the
    order is created, it logs the response to the console and resolves the Promise with the
    response. This function is used to generate a new Razorpay order for a given `orderId` and
    `total` amount. */
    generateRazorpay: (orderId, total) => {
        return new Promise((resolve, reject) => {
            instance.orders.create({
                amount: total,
                currency: "INR",
                receipt: "Order" + orderId,
                notes: {
                  key1: "value3",
                  key2: "value2"
                }
              }).then((res) => {
                console.log('razorpay instance:: ', res);
                resolve(res);
              })
        })
    }


}



module.exports = paymentHelper;