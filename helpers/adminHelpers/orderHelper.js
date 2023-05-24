//importing models
const orderCollection = require('../../models/order-model');



module.exports = {
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