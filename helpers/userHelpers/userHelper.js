const { ObjectId } = require('mongodb');
const customerCollection = require('../../models/user-model');

//controllers
const loginController = require('../../controllers/user-controller/login-controller');

//models
const user_address = require('../../models/address-model');

const order = require('../../models/order-model');

module.exports = {

    /* This is a function that retrieves all customers from a MongoDB collection called
    `customerCollection`. It returns a Promise that resolves with the result of the query. The
    function uses the `find()` method to retrieve all documents from the collection, and the
    `lean()` method to return plain JavaScript objects instead of Mongoose documents. The `exec()`
    method is used to execute the query, and the `then()` method is used to resolve the Promise with
    the query result. If an error occurs, it is caught and logged to the console. */
    allCustomers: () => {
        try{
            return new Promise(async (resolve, reject) => {
                await customerCollection.find().lean().exec().then((result) => {
                    resolve(result);
                })
            })
        } catch(err) {
            console.log('Error while fetching customers: '+ err);
        }
    },


    /* `findUserById` is a function that takes an `id` parameter and returns a Promise that resolves
    with the user document from the `customerCollection` MongoDB collection that matches the given
    `id`. It uses the `findOne()` method to find the document with the matching `_id` field, and the
    `lean()` method to return a plain JavaScript object instead of a Mongoose document. The `then()`
    method is used to resolve the Promise with the query result. If an error occurs, it is caught
    and logged to the console. */
    findUserById: (id) => {
        try{
            return new Promise((resolve, reject) => {
                customerCollection.findOne({ _id: new ObjectId(id) }).lean().then((result) => {
                    resolve(result);
                })
            })
        } catch(err){
            console.log('Error while fetching user by Id: '+ err);
        }
    },



    /* `updateUserById` is a function that takes two parameters: `userData` and `id`. It updates the
    user data in the MongoDB collection `customerCollection` for the user with the given `id`. It
    uses the `updateOne()` method to update the document with the matching `_id` field, and the
    `` operator to set the `phone`, `name`, and `email` fields to the values provided in the
    `userData` parameter. The function returns a Promise that resolves with the result of the update
    query. If an error occurs, it is caught and logged to the console. */
    updateUserById: (userData, id) => {
        try{
            return new Promise(async (resolve, reject) => {
                await customerCollection.updateOne({ _id: new ObjectId(id) }, { $set: { phone: userData.phone, name: userData.name, email: userData.email } }).then((result) => {
                    resolve(result);
                })
            })
        } catch(err) {
            console.log('Error while updating userdata: '+ err);
        }
    },



    /* `findBlockStatus` is a function that takes a `phone` parameter and returns a Promise that
    resolves with the user document from the `customerCollection` MongoDB collection that matches
    the given `phone`. It uses the `findOne()` method to find the document with the matching `phone`
    field, and the `then()` method is used to resolve the Promise with the query result. If an error
    occurs, it is caught and logged to the console. The function also logs the response to the
    console for debugging purposes. */
    findBlockStatus: (phone) => {
        try {
            return new Promise(async (resolve, reject) => {
                let status = {};
                await customerCollection.findOne({ phone: phone }).then((response) => {
                    console.log(response);

                    resolve(response);
                })
            })
        } catch (err) {
            console.log('Error while finding block status: '+ err);
        }
    },


    /* `addAddress` is a function that takes two parameters: `userId` and `address`. It adds an address
    to the `user_address` MongoDB collection for the user with the given `userId`. */
    addAddress: async (userId, address) => {
        try{
            let address_collection = await user_address.findOne({ userId: userId});

            return new Promise((resolve, reject) => {
                if(address_collection){
                    user_address.updateOne({userId: userId},{$push:{address: address}}).then((response) => {
                        user_address.findOne({userId: userId}).then((response)=> {
                            resolve(response);
                        })
                    })
                } else {
                    user_address.create({userId: userId, address: [address]}).then((response) => {
                        user_address.findOne({userId: userId}).then((response)=> {
                            resolve(response);
                        })
                    })
                }
            })
        } catch (err) {
            console.log('Error while adding Address: '+ err);
        }
    },


    /* `getAddress` is a function that takes a `userId` parameter and returns a Promise that resolves
    with the address document from the `user_address` MongoDB collection that matches the given
    `userId`. It uses the `findOne()` method to find the document with the matching `userId` field,
    and the `lean()` method to return a plain JavaScript object instead of a Mongoose document. The
    `then()` method is used to resolve the Promise with the query result. If an error occurs, it is
    caught and logged to the console. */
    getAddress: (userId) => {
        try{
            return new Promise((resolve, reject) => {
                user_address.findOne({userId: userId}).lean().then((response) => {
                    resolve(response);
                })
            })
        } catch(err){
            console.log('Error while getting address: ' + err);
        }
    },


    /* `deleteAddress` is a function that takes two parameters: `id` and `userId`. It deletes an
    address from the `user_address` MongoDB collection for the user with the given `userId`. It uses
    the `updateOne()` method to update the document with the matching `userId` field, and the
    `` operator to remove the address with the matching `_id` field from the `address` array.
    The function returns a Promise that resolves with the result of the update query. */
    deleteAddress: (id, userId) => {
        return new Promise((resolve, reject) => {
            user_address.updateOne({userId: userId}, {$pull: {address: {_id: id}}}).then((response) => {
                resolve(response);
            })
        })
    },

    

    //order section
    getOrders: (userId) => {
        return new Promise((resolve, reject) => {
            order.findOne({userId: userId}).populate('order.items.product').lean().exec().then((response) => {
                console.log('orderpage:::', response.order[0].products[0].product);
                resolve(response);
            })
        })
    }


}