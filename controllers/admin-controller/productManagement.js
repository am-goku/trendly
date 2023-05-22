const productHelper = require('../../helpers/productHelpers/productHelper');
const categoryHelper = require('../../helpers/productHelpers/categoryHelper');

// additional variables
const title = 'Admin Panel';
let admin = true;


module.exports = {

    showProducts: (req, res, next) => {
        productHelper.showProductsAdmin().then((products) => {
            res.render('admin/products', {products, title, admin});
        })
    },
    
    getEditProduct: (req, res, next) => {
        let id = req.params.id;
        console.log(id);
        productHelper.findProductById(id).then((product) => {
            categoryHelper.allCategory().then((category) => {
                res.render('admin/editProduct', { admin, title, product, category })
            })
        })
    },

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