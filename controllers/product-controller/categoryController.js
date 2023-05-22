const category = require('../../models/category-model');
const products = require('../../models/product-model');

//imported Helpers
const categoryHelper = require('../../helpers/productHelpers/categoryHelper');

//additional variables


module.exports = {
    addCategory: async(req, res, next) => {
        let categoryData = req.body;
        console.log('body: '+ categoryData.name);
        await categoryHelper.addCategory(categoryData).then((result) => {
            console.log('category added successfully');
            res.redirect('/admin/categories');
        })
    },

    allCategories: async (req, res) => {
        await categoryHelper.allCategory().then((category) => {
            res.render('admin/categories', {category, admin:true})
        })
    },

    deleteCategory: (req, res, next) => {
        console.log('hiiiiiiii: '+ req.params.id);
        try {
            let id = req.params.id;
            categoryHelper.deleteCategory(id).then((result) => {
                res.redirect('/admin/categories');
            });
        } catch (err) {
            console.log(err.message);
        }
    },



}