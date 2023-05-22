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
                          from: "user", // Specify the referenced collection name
                          localField: "order.userId",
                          foreignField: "_id",
                          as: "order.user"
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
    }
}