//imported Helpers
const categoryHelper = require('../../helpers/productHelpers/categoryHelper');

//additional variables


module.exports = {
    /* `addCategory` is a function that handles the addition of a new category. It takes in the
    request, response, and next middleware function as parameters. It first retrieves the category
    data from the request body and then uses the `categoryHelper.addCategory()` function to add the
    category to the database. It then redirects the user to the `/admin/categories` page. The
    function is asynchronous and uses `await` to wait for the `categoryHelper.addCategory()`
    function to complete before redirecting the user. */
    addCategory: async(req, res, next) => {
        const categoryData = req.body;
        console.log('body: '+ categoryData.name);
        await categoryHelper.addCategory(categoryData).then((result) => {
            console.log('category added successfully');
            res.redirect('/admin/categories');
        })
    },

    /* `allCategories` is a function that retrieves all categories from the database using the
    `categoryHelper.allCategory()` function. It then renders the `admin/categories` view and passes
    the retrieved categories as an object with the key `category` and the value `category`, and also
    passes `admin:true` as an object to the view. This function is asynchronous and uses `await` to
    wait for the `categoryHelper.allCategory()` function to complete before rendering the view. */
    allCategories: async (req, res) => {
        await categoryHelper.allCategory().then((category) => {
            res.render('admin/categories', {category, admin:true})
        })
    },

    /* `deleteCategory` is a function that handles the deletion of a category. It takes in the request,
    response, and next middleware function as parameters. */
    deleteCategory: (req, res, next) => {
        try {
            const id = req.params.id;
            categoryHelper.deleteCategory(id).then((result) => {
                res.redirect('/admin/categories');
            });
        } catch (err) {
            console.log(err.message);
        }
    },



}