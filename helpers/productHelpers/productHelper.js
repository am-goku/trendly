const { Reject } = require('twilio/lib/twiml/VoiceResponse');
const product = require('../../models/product-model');
const category = require('../../models/category-model');
const { ObjectId } = require('mongodb');


module.exports = {

    /* This function is adding a new product to the database. It takes in two parameters:
    `productDetails` which contains the details of the product such as name, description, price,
    discount, stock, category, color, and size; and `image` which contains the image file of the
    product. */
    addProduct: async (productDetails, image) => {
        try {
            const newProduct = new product({
                productName: productDetails.name,
                description: productDetails.description,
                productPrice: productDetails.price,
                discountPercentage: productDetails.discount,
                stock: productDetails.stock,
                category: productDetails.categoryId,
                images: image.filename,
                color: productDetails.color,
                size: productDetails.size,
            });

            await newProduct.save();
            return;

        } catch (err) {
            console.log(err);
        }
    },


    /* `showProducts` is a function that retrieves a list of products from the database and returns
    them along with the total number of pages based on the given `currentPage` and `itemsPerPage`
    parameters. It uses pagination to limit the number of products returned per page and skips the
    appropriate number of documents based on the current page. It also populates the `category`
    field of each product with the corresponding category document from the `category` collection.
    The function returns a Promise that resolves with an object containing the list of products and
    the total number of pages. If an error occurs, the Promise is rejected with the error. */
    showProducts: (currentPage, itemsPerPage) => {
        return new Promise((resolve, reject) => {
          product.find()
            .populate('category')
            .lean()
            .skip((currentPage - 1) * itemsPerPage) // Skip the appropriate number of documents based on the current page
            .limit(itemsPerPage) // Limit the number of documents per page
            .exec()
            .then((products) => {
              product.countDocuments().exec().then((totalCount) => { // Get the total count of products
                const totalPages = Math.ceil(totalCount / itemsPerPage);
                resolve({ products, totalPages });
              }).catch((err) => {
                reject(err);
              });
            })
            .catch((err) => {
              reject(err);
            });
        });
      },
      



      /* `showProductsAdmin` is a function that retrieves all products from the database and returns
      them along with their corresponding category documents from the `category` collection. It
      returns a Promise that resolves with an array of products. The function uses the `find` method
      to retrieve all products and the `populate` method to populate the `category` field of each
      product with the corresponding category document. The `lean` method is used to return plain
      JavaScript objects instead of Mongoose documents. Finally, the function returns a Promise that
      resolves with the array of products. */
      showProductsAdmin: ()=> {
        return new Promise((resolve, reject) => {
          product.find({}).populate('category').lean().then((products) => {
            resolve(products);
          })
        })
      },







    /* `findProductById` is a function that takes in an `id` parameter and returns a Promise that
    resolves with the product document that matches the given `id`. It uses the `findById` method of
    the `product` model to find the product document with the given `id`. It also populates the
    `category` field of the product document with the corresponding category document from the
    `category` collection using the `populate` method. The `lean` method is used to return plain
    JavaScript objects instead of Mongoose documents. Finally, the function returns a Promise that
    resolves with the product document. */
    findProductById: (id) => {
        return new Promise((resolve, Reject) => {
            product.findById(id).populate('category').lean().exec().then((product) => {
                resolve(product);
            })
        })
    },



    /* `updateProductById` is a function that takes in three parameters: `id`, `productDetails`, and
    `image`. It updates the product with the given `id` in the database with the new
    `productDetails` and `image`. It returns a Promise that resolves with the updated product
    document. */
    updateProductById: (id, productDetails, image) => {
        return new Promise(async (resolve, Reject) => {
            console.log(id, productDetails,image);
        try{
            const updatedProduct = await product.updateOne({_id: new ObjectId(id)}, {$set:{
                productName: productDetails.name,
                description: productDetails.description,
                productPrice: productDetails.price,
                discountPercentage: productDetails.discount,
                stock: productDetails.stock,
                category: productDetails.categoryId,
                images: image.filename,
            }});

            resolve(updatedProduct);
        } catch(error){
            console.log(error);
        }
        })
    },


    searchProduct: (keyword, page, itemsPerPage) => {
        try {
          return new Promise((resolve, reject) => {
            const skip = (page - 1) * itemsPerPage;
            const query = product.find({ productName: { $regex: keyword, $options: 'i' } });
            
            // Fetch the total count of matching documents for pagination
            const totalCountPromise = product.countDocuments({ productName: { $regex: keyword } });
      
            // Fetch the products for the current page
            const productsPromise = query
              .skip(skip)
              .limit(itemsPerPage)
              .lean()
              .exec();
      
            Promise.all([productsPromise, totalCountPromise])
              .then(([products, totalCount]) => {
                resolve({ products, totalCount });
              })
              .catch(error => {
                reject(error);
              });
          });
        } catch (error) {
          console.log('Search product failed: ', error);
          throw error;
        }
      }
      

}