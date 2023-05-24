const categoryHelper = require('../../helpers/productHelpers/categoryHelper');
const productHelper = require('../../helpers/productHelpers/productHelper');

const product = require('../../models/product-model')

// const fileUpload 

//additional variables
let errMsg = false;
let admin = true;

module.exports = {
    getAddProduct: (req, res, next) => {
        categoryHelper.allCategory().then((category) => {
          res.render('admin/addProduct',{admin, category})
        })
    },

    postAddProduct: async (req, res) => {
      let productDetails = req.body;
      let image = req.file;
      console.log(image);

      try{

        await productHelper.addProduct(productDetails, image);
        res.redirect('/admin/products');

      } catch(err){
        console.log(err);
      }
    
    },


    // showProducts: (req, res, next) => {
    //   let customer = req.session.user;
    //   productHelper.showProducts().then((products) => {
    //     res.render('shop/products',{products, productsActive:true, customer});
    //   })
    // },

    // showProducts: (req, res, next) => {
    //   try{
    //       let customer = req.session.user;
    //       const currentPage = parseInt(req.query.page) || 1; // Get the current page from the query parameters, default to 1 if not provided
    //       const itemsPerPage = 5; // Number of products to display per page

    //       productHelper.showProducts(currentPage, itemsPerPage).then((result) => {
    //         const products = result.products;
    //         const totalPages = result.totalPages;
            
          
    //         res.render('shop/products', { products, productsActive: true, customer, currentPage, totalPages});
    //       }).catch((err) => {
    //         console.log(err);
    //         // Handle the error
    //       });
    //   } catch (err) {
    //     console.log('getproducts error::: ', err);
    //   }
    // },
    showProducts: (req, res, next) => {
      try {
        let customer = req.session.user;
        const currentPage = parseInt(req.query.page) || 1; // Get the current page from the query parameters, default to 1 if not provided
        const itemsPerPage = 5; // Number of products to display per page
    
        // Retrieve the filter parameters from the query parameters
        const sortBy = req.query.sort || ""; // Sort parameter
        const priceRange = req.query.price || ""; // Price range parameter
        const color = req.query.color || ""; // Gender parameter
        const category = req.query.cat || ""; // Tag parameter
    
        // Call the productHelper function with the filter parameters
        productHelper.showFilteredProducts(currentPage, itemsPerPage, { sortBy, priceRange, color, category })
          .then((result) => {
            const products = result.products;
            const totalPages = result.totalPages;
            const filterOptions = result.filterOptions;
    
            res.render('shop/products', { products, productsActive: true, customer, currentPage, totalPages, filterOptions });
          })
          .catch((err) => {
            console.log(err);
            // Handle the error
          });
      } catch (err) {
        console.log('showProducts error:', err);
      }
    },
    
    







    findProduct: (req, res, next) => {
      let id = req.params.id;
      productHelper.findProductById(id).then((product) => {
        res.render('shop/singleProduct', {product, admin:false, customer:req.session.user})
        console.log(product.images);
      })
    },


    // searchProduct: (req, res, next) => {
    //   let customer = user = req.session.user;
    //   let keyword = req.body.keyword;
    //   productHelper.searchProduct(keyword).then((products) => {
    //     res.render('shop/products', {products, customer, user, productsActive: true })
    //   })
    // }

    searchProduct: (req, res, next) => {
      const customer = user = req.session.user;
      const keyword = req.query.keyword;
      const page = parseInt(req.query.page) || 1; // Get the current page from the query parameter
      const itemsPerPage = 5; // Define the number of items to display per page
    
      productHelper.searchProduct(keyword, page, itemsPerPage)
        .then(({ products, totalCount }) => {
          const totalPages = Math.ceil(totalCount / itemsPerPage);
          res.render('shop/products', {
            products,
            customer,
            user,
            productsActive: true,
            totalPages,
            currentPage: page,
          });
        })
        .catch(error => {
          console.log('Search product failed: ', error);
          // Handle the error appropriately
        });
    },




    sortLProduct: (req, res, next) => {
      product.find().sort({productPrice: 1}).lean().then((products)=> {
        res.render('shop/products', {products, customer: req.session.user, user: req.session.user})
      })
    },

    sortHProduct: (req, res, next) => {
      product.find().sort({productPrice: -1}).lean().then((products)=> {
        res.render('shop/products', {products, customer: req.session.user, user:req.session.user})
      })
    }
    


}