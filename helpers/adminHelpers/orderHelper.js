//importing models
const orderCollection = require('../../models/order-model');



module.exports = {
    /* This is a function called `getOrders` that returns a promise. It uses the `aggregate` method of
    the `orderCollection` to perform a lookup on the `users` collection and retrieve the details of
    the user who placed the order. It then projects the result to only include the `order` field and
    logs the response to the console. If there is an error, it logs the error to the console. */
    getOrders: () => {
        try{
            return new Promise((resolve, reject) => {
                orderCollection.aggregate([
                    {$unwind: '$order'}, 
                    {
                        $lookup: {
                          from: "users", // Specified the referenced collection name
                          localField: "order.user",
                          foreignField: "_id",
                          as: "order.userDetails"
                        }
                    },
                    {$project: {_id:0, order: '$order'}}
                ]).exec().then((response) => {
                    console.log(response);
                    resolve (response);
                })
            })
        } catch(err) {
            console.log('error getting orders', err);
        }
    },

    /* `getOrderDetails` is a function that takes in two parameters, `orderId` and `userId`. It returns
    a promise that resolves to the details of a specific order placed by a user. */
    getOrderDetails: (orderId, userId) => {
        try {
            return  new Promise((resolve, reject) => {
                orderCollection.findOne({userId: userId, 'order._id': orderId}, {'order.$': 1})
                    .populate('order.user')
                    .populate('order.items.product').lean()
                    .then((response) => {
                        console.log('response after getiing order details',response);
                        resolve(response);
                    }).catch((err) => {
                        console.log('error on getting order details inside helper',err);
                    })
            })
        } catch(err) {
            console.log('Error in orderHelper while getting orderdetails', err);
        }
    },


    /* `manageOrder` is a function that takes in three parameters: `orderStatus`, `orderId`, and
    `userId`. It returns a promise that resolves to the result of updating the status of a specific
    order placed by a user. */
    manageOrder: (orderStatus, orderId, userId) => {
        try{
            return new Promise((resolve, reject) => {
                orderCollection.updateOne(
                    { userId: userId, "order._id": orderId },
                    { $set: { "order.$.status": orderStatus } }
                ).then((response)=>{
                    resolve(response);
                }).catch((error)=>{
                    console.log('Error in helper while changing order status:',error);
                })
            })
        } catch (error) {
            console.log('Error in helper while changing order status:',error);
        }
        
    }
}