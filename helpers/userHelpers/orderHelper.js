//importing models
const orderCollection = require('../../models/order-model');
const productCollection = require('../../models/product-model');

//importing libraries
const mongoose = require('mongoose');



const orderHelper = {
    getAnOrder:  (orderId, userId) => {
        try {
            return new Promise(async (resolve, reject) => {
                // Get the user's order
                const orderColl = await orderCollection.findOne({ userId: userId, 'order._id': orderId });
                // console.log(order);
                let order;
                for(let i=0; i<orderColl.order.length; i++) {
                    if(orderColl.order[i]._id == orderId) {
                        order = orderColl.order[i];
                        break;
                    } 
                }
                console.log(order);

                if (!order) {
                  throw new Error('Order not found');
                }
            
                let products = [];
                let product, productId, quantity;
            
                for (let i = 0; i < (order.products).length; i++) {
                    productId = ''+order.products[i].product;
                    // const objectIdMatch = productId.match(/ObjectId\("(.+)"\)/);
                    const idValue = productId.replace('/new ObjectId\("(.+)"\)/', '$1');
                    
                   productCollection.findOne({ _id: idValue }).then((product) => {
                       quantity = order.products[i].quantity;
                       products.push({ product, quantity });
                   })
                //    console.log(objectId);
                
                //   if (!product) {
                //     throw new Error(`Product with ID ${productId} not found`);
                //   }
                  
                }

                console.log('hello::', products);

                resolve (products);
            })
        } catch (error) {
          console.error(error);
          throw error;
        }
      }
      
}



module.exports = orderHelper;