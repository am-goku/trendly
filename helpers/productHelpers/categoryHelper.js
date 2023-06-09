const { ObjectId } = require('mongodb');
const category = require('../../models/category-model');
const product = require('../../models/product-model');


module.exports = {

    /* This is a function that adds a new category to the database. It takes in a parameter
    `categoryData` which is an object containing the details of the category to be added. The
    function returns a Promise that resolves to the result of saving the new category to the
    database. */
    addCategory: (categoryData) => {
        try{
            return new Promise(async (resolve, reject) => {
                let categories = new category(categoryData);
                await categories.save().then((result) => {
                    resolve(result);
                })
            })
        } catch(err){
            console.log('Error while assing category: ' + err);
        }
    },

    /* This is a function that retrieves all categories from the database. It returns a Promise that
    resolves to an array of category objects. It uses the `category` model to find all categories in
    the database using the `find()` method, and then uses the `lean()` method to return plain
    JavaScript objects instead of Mongoose documents. Finally, it uses the `exec()` method to
    execute the query and resolve the Promise with the resulting array of category objects. If there
    is an error while fetching the categories, it logs an error message to the console. */
    allCategory: () => {
        try{
            return new Promise(async (resolve, reject) => {
                const categories = await category.find().lean().exec();
                resolve (categories);
            })
        } catch(err){
            console.log('Error while fetching categories: ' + err);
        }
    },

    /* This is a function that deletes a category from the database based on the provided `id`. It
    takes in a parameter `id` which is the unique identifier of the category to be deleted. The
    function returns a Promise that resolves to the result of deleting the category from the
    database. */
    deleteCategory: (id) => {
        try{
            return new Promise((resolve, reject) => {
                category.deleteOne(_id = new ObjectId(id)).then((response) => {
                    resolve (response);
                })
            })
        } catch (err) {
            console.log('error while deleting category: ' + err);
        }
    },

}