//importing models
const orderCollection = require('../../models/order-model');
const productCollection = require('../../models/product-model');

//importing libraries
const mongoose = require('mongoose');



const orderHelper = {



    /* `getAnOrder` is a function that takes in two parameters `orderId` and `userId`. It attempts to
    find an order in the `orderCollection` with the given `orderId` and `userId`. If the order is
    found, it populates the `product` field of the order items and returns the order. If the order
    is not found, it throws an error. The function returns a promise that resolves with the order or
    rejects with an error. */
    getAnOrder:  (orderId, userId) => {
        try {
            return new Promise(async (resolve, reject) => {
                // Get the user's order
                const orderColl = await orderCollection.findOne(
                                    {userId: userId, 'order._id': orderId},
                                    {'order.$': 1}
                                    ).populate('order.items.product').lean();
                                    

                console.log('its order collection',orderColl);
                const order = orderColl.order[0];
                
                console.log(order);

                if (!order) {
                  throw new Error('Order not found');
                }

                // console.log('hello::', products);

                resolve (order);
            })
        } catch (error) {
          console.error(error);
          throw error;
        }
    },



    /* `cancelOrder` is a function that takes in two parameters: `orderId` and `userId`. It attempts
    to cancel an order by updating the `orderCollection` with the given `orderId` and `userId`. It
    returns a promise that resolves with the response from the update operation. If there is an
    error, it logs the error to the console. The update operation sets the `status` field of the
    order with the given `orderId` and `userId` to "cancelled". */
    cancelOrder: (orderId, userId) => {
        try{
            return new Promise((resolve, reject) => {
                orderCollection.updateOne(
                    { userId: userId, "order._id": orderId },
                    { $set: { "order.$.status": "cancelled" } }
                ).then((response)=>{
                    resolve(response);
                })
            })
        } catch(err){
            console.log('Error while canceling an Order:', err);
        }
    },

    /* `returnOrder` is a function that takes in two parameters `orderId` and `userId`. It attempts to
    update the `orderCollection` by setting the `status` field of the order with the given `orderId`
    and `userId` to "return-pending". It returns a promise that resolves with the response from the
    update operation. If there is an error, it logs the error to the console. */
    returnOrder: (orderId, userId) => {
        try{
            return new Promise((resolve, reject) => {
                orderCollection.updateOne(
                    { userId: userId, "order._id": orderId },
                    { $set: { "order.$.status": "return-pending" } }
                ).then((response)=>{
                    resolve(response);
                })
            })
        } catch(err){
            console.log('Error while canceling an Order:', err);
        }
    }
      
}



module.exports = orderHelper;