//razorpay
const dotenv = require('dotenv');
dotenv.config();
const secretKey = process.env.RZP_SECRET_KEY;
const Razorpay = require('razorpay');
var instance = new Razorpay({
    key_id: 'rzp_test_MTk5iQyefsRP1C',
    key_secret: secretKey,
  });




//import models
const shopping_cart = require('../../models/cart-model');
const customer = require('../../models/user-model');

const order = require('../../models/order-model');

// additional functions
    //1-----checking the ordernumber is unique or not
        async function checkOrderNumber(orderNo){
            let orderNumber = await order.find({"orderNo": orderNo});
            if(!orderNumber) {
                return true;
            } else {
                return false;
            }
        }

    // 2-----function to genarate random five didgit number for orders
        function genarateOrderNo() {
            let min = 10000, max = 99999;
            let randomNo = Math.floor(Math.random() * (max - min + 1)) + min;
            let OrderNo = 'TDLY'+randomNo;
            let available = checkOrderNumber(OrderNo);
            if(available) {
                return OrderNo;
            } else {
                genarateOrderNo();
            }
        }
    



const paymentHelper = {

    /* The `completeOrder` function is a helper function that takes in three parameters: `userId`,
    `address`, and `paymentMethod`. */
    completeOrder: async (userId, address, paymentMethod, coupon) => {
        console.log('this is the address pass for payment', address);
        const cart = await shopping_cart.findOne({userId: userId}).populate('items.product');
        let totalAmount = 0, date = Date.now();

        //genarating orderNo.
        let orderNo = genarateOrderNo();
        

        //loop to calculate the total amount;
            for(let i=0; i<cart.items.length; i++) {
                totalAmount += (cart.items[i].product.productPrice * cart.items[i].quantity);
            }
        //discount applying and tax towards total amount (pending)
            const shipping = 50; // setting it as a constant for now
            totalAmount += shipping;
            totalAmount = totalAmount - coupon.discount;

        //getting order collection
            let orderCollection = await order.findOne({userId: userId});
        //updating or creating order
            return new Promise((resolve, reject) => {
                if(orderCollection){ 
                    order.updateOne({userId: userId}, {$push: {order: {orderNo: orderNo, items: cart.items, totalAmount: totalAmount, userId: userId, date: date, paymentMethod: paymentMethod, address: address, discount: coupon.discount}}})
                    .then(async (response) => {
                        await customer.updateOne({userId: userId}, {$push: {usedCoupons: coupon.code}});
                        order.findOne({userId: userId}).populate('order.items.product').lean().then((res) => {
                            resolve(res);
                        })
                    })
                } else {
                    order.create({userId: userId, order:[{orderNo: orderNo, items: cart.items, totalAmount: totalAmount, userId: userId, date: date, paymentMethod: paymentMethod, address: address, discount: coupon.discount}]})
                    .then((response) => {
                        order.findOne({userId: userId}).populate('order.items.product').lean().then((res) => {
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