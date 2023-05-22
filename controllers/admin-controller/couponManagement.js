const couponCollection = require('../../models/coupon');


module.exports = {


    /* This code defines a function called `getCoupon` that handles a GET request to retrieve all the
    coupons from the database. It uses the `couponCollection.find()` method to retrieve all the
    documents from the `cou pon` collection and then renders the `admin/coupon` view with the
    retrieved data. If there is an error, it logs the error and redirects the user to the `/admin`
    page. The function is defined as an asynchronous function, which allows the use of the `await`
    keyword to wait for the database operation to complete before continuing. */
    getCoupon: async (req, res, next)=>{
        await couponCollection.find({}).lean()
        .then((coupon) => {
             
            res.render('admin/coupon', { coupon, admin: req.session.admin });
        })
        .catch((err) => {
            console.error(err);
            res.redirect('/admin');
        });
    },





    /* This code defines a function called `addCoupon` that handles a POST request to add a new coupon
    to the database. It first extracts the coupon data from the request body, then uses the
    `couponCollection.create()` method to create a new document in the `coupon` collection with the
    provided data. If the creation is successful, it redirects the user to the `/admin/coupon` page.
    If there is an error, it logs the error and redirects the user to the same page. The function is
    defined as an asynchronous function, which allows the use of the `await` keyword to wait for the
    database operation to complete before continuing. */
    addCoupon: async (req, res, next)=> {
        try{
            let coupon = req.body;

            await couponCollection.create({ 
                code: coupon.code, 
                discount: coupon.discount, 
                minAmount: coupon.min, 
                maxAmount: coupon.max, 
                startDate: coupon.startDate, 
                expireDate: coupon.expireDate
            }).then((res) => {
                res.redirect('/admin/coupon');
            }).catch((err) => {
                console.error(err);
                res.redirect('/admin/coupon');
            });
        } catch (error) {
            console.log('Error while adding coupons ::', error);
        }
    },


    removeCoupon: (req, res, next) => {
        try {
            let couponId = req.query.couponId;
            console.log(couponId);
            couponCollection.deleteOne({_id: couponId}).then((response) => {
                console.log(response, 'fffffff');
                res.redirect('/admin/coupon');
            })
        } catch (err) {
            console.log('Controller Error while removing coupon ::', err);
            res.redirect('/admin');
        }

    }


}