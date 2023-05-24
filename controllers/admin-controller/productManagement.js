const productHelper = require('../../helpers/productHelpers/productHelper');
const categoryHelper = require('../../helpers/productHelpers/categoryHelper');

// additional variables
const title = 'Admin Panel';
let admin = true;


module.exports = {

    /* This is a controller function that is responsible for rendering the admin panel's products page.
    It calls the `showProductsAdmin()` function from the `productHelper` module to retrieve all
    products from the database and then renders the `admin/products` view with the retrieved
    products, `title`, and `admin` variables. */
    showProducts: (req, res, next) => {
        productHelper.showProductsAdmin().then((products) => {
            res.render('admin/products', {products, title, admin});
        })
    },
    
    /* This is a controller function that handles a GET request to the `/admin/products/edit/:id`
    route. It retrieves the `id` parameter from the request URL, then calls the `findProductById()`
    function from the `productHelper` module to retrieve the product with the corresponding `id`
    from the database. It also calls the `allCategory()` function from the `categoryHelper` module
    to retrieve all categories from the database. Once both promises are resolved, it renders the
    `admin/editProduct` view with the retrieved `product`, `category`, `admin`, and `title`
    variables. */
    getEditProduct: (req, res, next) => {
        let id = req.params.id;
        console.log(id);
        productHelper.findProductById(id).then((product) => {
            categoryHelper.allCategory().then((category) => {
                res.render('admin/editProduct', { admin, title, product, category })
            })
        })
    },

    /* `postEditProduct` is a controller function that handles a POST request to the
    `/admin/products/edit/:id` route. It retrieves the `id` parameter from the request URL, the
    product details from the request body, and the image from the request file. It then calls the
    `updateProductById()` function from the `productHelper` module to update the product with the
    corresponding `id` in the database with the new product details and image. Once the promise is
    resolved, it redirects the user to the `/admin/products` route. */
    postEditProduct: (req, res, next) => {
        let id = req.params.id;
        let productDetails = req.body;
        let image = req.file;


        productHelper.updateProductById(id, productDetails, image).then((response)=> {
            if(response){
                res.redirect('/admin/products');
            }
        })
    },


}