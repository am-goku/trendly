const categoryHelper = require('../../helpers/productHelpers/categoryHelper');
const productHelper = require('../../helpers/productHelpers/productHelper');

const product = require('../../models/product-model')

// const fileUpload 

//additional variables
let errMsg = false;
let admin = true;

module.exports = {
    /* `getAddProduct` is a function that handles a GET request to display the add product page for the
    admin. It retrieves all the categories from the database using the `allCategory` function from
    the `categoryHelper` module and then renders the `addProduct` view, passing in the `admin` and
    `category` variables. */
    getAddProduct: (req, res, next) => {
        categoryHelper.allCategory().then((category) => {
          res.render('admin/addProduct',{admin, category})
        })
    },

    /* `postAddProduct` is a function that handles a POST request to add a new product to the database.
    It first retrieves the product details and image file from the request body and then calls the
    `addProduct` function from the `productHelper` module, passing in the product details and image
    file as parameters. The `addProduct` function is an asynchronous function that adds the product
    to the database and returns a promise. The `await` keyword is used to wait for the promise to
    resolve before redirecting the user to the product list page. If there is an error, it is caught
    and logged to the console. */
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


    
    /* `showProducts` is a function that handles a request to display a list of products on a page. It
    first retrieves the current page number and the number of products to display per page from the
    request parameters. It then retrieves the filter parameters (sorting order, price range, color,
    and category) from the request parameters. It calls the `showFilteredProducts` function from the
    `productHelper` module, passing in the filter parameters and the current page number and number
    of products to display per page. Once the products are retrieved, it renders the `products` view
    and passes in the products, along with the current page number, total number of pages, and
    filter options. If there is an error, it logs the error to the console. */
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
    
    







    /* `findProduct` is a function that handles a request to find a single product by its ID. It takes
    in the request, response, and next middleware functions as parameters. It first retrieves the
    product ID from the request parameters and then calls the `findProductById` function from the
    `productHelper` module, passing in the ID as a parameter. Once the product is retrieved, it
    renders the `singleProduct` view and passes in the product details, along with the `admin` and
    `customer` variables. Finally, it logs the product images to the console. */
    findProduct: (req, res, next) => {
      let id = req.params.id;
      productHelper.findProductById(id).then((product) => {
        res.render('shop/singleProduct', {product, admin:false, customer:req.session.user})
        console.log(product.images);
      })
    },


    /* `searchProduct` is a function that handles a search request for products based on a keyword. It
    takes in the request, response, and next middleware functions as parameters. It first retrieves
    the keyword and page number from the request parameters and sets the number of items to display
    per page. It then calls the `searchProduct` function from the `productHelper` module, passing in
    the keyword, page number, and items per page as parameters. */
    searchProduct: (req, res, next) => {
      const customer = user = req.session.user;
      const keyword = req.body.keyword;
      const page = parseInt(req.query.page) || 1; // Get the current page from the query parameter
      const itemsPerPage = 5; // Define the number of items to display per page
    
      productHelper.searchProduct(keyword, page, itemsPerPage)
        .then(({ products, totalCount }) => {
          const totalPages = Math.ceil(totalCount / itemsPerPage);
          // res.render('shop/products', {
          //   products,
          //   customer,
          //   user,
          //   productsActive: true,
          //   totalPages,
          //   currentPage: page,
          // });
          res.status(200).json({products: products, totalPages: totalPages});
        })
        .catch(error => {
          console.log('Search product failed: ', error);
          // Handle the error appropriately
        });
    },



    /* `filterProducts` is a function that handles a request to filter products based on certain
    criteria such as color, category, price range, and sorting order. It takes in the request,
    response, and next middleware functions as parameters. It first retrieves the filter parameters
    from the request body and parses them into the appropriate data types. It then constructs a
    filter object and a sort option object based on the filter parameters. Finally, it uses the
    `product` model to find products that match the filter criteria and sorts them based on the sort
    option. The function then sends a JSON response containing the filtered products. */
    filterProducts: async (req, res, next) => {
      let color = JSON.parse(req.body.color);
      let category = JSON.parse(req.body.category);
      let priceRange = JSON.parse(req.body.priceRange);
      let sort = req.body.sort;
      
      
      let filter = {};
      let sortOption = {};

      if (color.length) {
        filter.color = { $in: color };
      }
      if (category.length) {
        filter.category = { $in: category };
      }
      if (priceRange && priceRange.length === 2) {
        if(!priceRange[1]){
          filter.productPrice = { $gte: priceRange[0] };
        } else {
          filter.productPrice = { $gte: priceRange[0], $lte: priceRange[1] };
        }
      }

      if (sort === 'asc') {
        sortOption = { productPrice: 1 }; // Sorting in ascending order by productName field
      } else if (sort === 'desc') {
        sortOption = { productPrice: -1 }; // Sorting in descending order by productName field
      } else {
        sortOption = { productPrice: 0 };
      }

      console.log(sortOption, filter, req.body);

      let products = await product.find(filter).sort(sortOption)

      res.status(200).json({products: products});

    }
    


}