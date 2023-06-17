const express = require('express');
const router = express.Router();

//importing controllers
const loginController = require('../controllers/user-controller/loginController');
const registerConteroller = require('../controllers/user-controller/registerController');
const passwordController = require('../controllers/user-controller/passwordController');
const userController = require('../controllers/user-controller/userController');
const otpController = require('../controllers/user-controller/otpController');
const productController = require('../controllers/product-controller/productController');
const cartController = require('../controllers/product-controller/cartController');
const profileManager = require('../controllers/user-controller/profileManageController');
const orderManagement = require('../controllers/user-controller/userOrderManageController');
const paymentController = require('../controllers/user-controller/paymentController');
const couponManagement = require('../controllers/user-controller/userCouponController')
const wishlistController = require('../controllers/product-controller/wishlistController');

//requiring multer middleware
const upload = require('../middlewares/multer');




/* GET home page. */
router.get('/', userController.getHome);



//Register
router.get('/register', registerConteroller.getRegister);

router.post('/register', registerConteroller.postRegister);

router.get('/register/phone', registerConteroller.getPhoneNumer);

router.post('/register/phone', registerConteroller.postPhoneNumber);

router.post('/otpVarification', registerConteroller.otpVerification);

router.post('/resendOtp', otpController.resendOtp);

router.post('/checkUserEmail', registerConteroller.checkEmail);




//login
router.get('/login', userController.getLoginUserStatus, loginController.getLogin);

router.post('/login',userController.checkBlockedStatus, loginController.postLogin);

router.post('/loginOtp', userController.checkBlockedStatus, loginController.otpLogin);

router.post('/verifyOtpLogin', loginController.verifyOtpLogin)



//Password
router.get('/forgotPassword', passwordController.getForgotPassword);

router.post('/forgotPassword', passwordController.postForgotPassword );

router.post('/resetPassword/varifyOtp', passwordController.varifyOtp);

router.get('/resetPassword', passwordController.getResetPassword);

router.post('/resetPassword', passwordController.updatePassword );







//products
router.get('/products', productController.showProducts);

router.get('/products/:id', productController.findProduct);






//search products
router.post("/searchProduct", productController.searchProduct)

router.post('/filterProducts', productController.filterProducts )



///////////////// CART MANAGEMENT SECTION //////////////////////////////////

//Routes to SHOW and ADD products to cart
router.get('/cart', userController.userLoginStatus, userController.checkBlockedStatus, cartController.showCart)

router.post('/addtoCart', userController.userLoginStatus, userController.checkBlockedStatus, cartController.addtoCart);

//check if the product with particular varient is inside the cart of the user or not
router.post('/checkProductInCart', cartController.checkProduct);


// Function to ADD and REDUCE to the quantity of the products by one i database.
router.post('/addQuantity', cartController.addQuantity);
router.post('/reduceQuantity', cartController.reduceQuantity);


//function to remove items from cart
router.get('/removeFromCart/:id', cartController.removeItem );





//wishlist management
router.get('/wishlist', userController.userLoginStatus, userController.checkBlockedStatus, wishlistController.getWishlist);

router.post('/addToWishlist', userController.userLoginStatus, userController.checkBlockedStatus, wishlistController.addToWhishlist);

router.post('/removeFromWishlist', wishlistController.removeFromWishlist );




//profile of customers

router.get('/profile', userController.userLoginStatus, userController.checkBlockedStatus, userController.getProfile);

router.post('/updateProfile', userController.userLoginStatus, userController.checkBlockedStatus, upload.single('userImage'), profileManager.updateProfile );

router.post('/check-password', passwordController.checkPassword )

router.post('/updatePassword', passwordController.changePassword)





//Address management

router.post('/addAddress', userController.userLoginStatus, userController.checkBlockedStatus, profileManager.addAddress);

router.get('/deleteAddress/:id', userController.userLoginStatus, userController.checkBlockedStatus, profileManager.deleteAddress);

router.post('/getAnAddress',userController.userLoginStatus, userController.checkBlockedStatus, profileManager.getAnAddrress);



//checkout section

router.get('/checkout', userController.userLoginStatus,userController.checkBlockedStatus, orderManagement.showAddress);

router.get('/orders', userController.userLoginStatus,userController.checkBlockedStatus, orderManagement.showOrders);


router.post('/verifyPayment', (req, res) => {
    console.log('payment verification:::::'+JSON.stringify(req.body));
})

router.post('/rejectPayment', (req, res) => {
    console.log('payment rejected');
})


//order management section
router.get('/order/details', userController.userLoginStatus, userController.checkBlockedStatus, orderManagement.getAnOrder);


router.post('/cancelOrder', userController.userLoginStatus, userController.checkBlockedStatus, orderManagement.cancelOrder);
router.post('/returnOrder', userController.userLoginStatus, userController.checkBlockedStatus, orderManagement.returnOrder)




// coupon management
router.post('/check-coupon', couponManagement.checkCoupon);

router.post('/cancel-coupon', couponManagement.cancelCoupon );










//blog management
router.get('/blog', (req, res, next) => {
    res.render('shop/blog')
})





//logout
router.get('/logout', loginController.logout);


//trials
router.get('/lol', (req, res)=> {
    res.render('shop/orderDetails');
})

//payment
router.post('/payment', userController.userLoginStatus, userController.checkBlockedStatus, paymentController.doPayment)

router.get('/confirm', userController.userLoginStatus,userController.checkBlockedStatus, (req, res)=> {
    res.render('shop/confirmation', {order: req.session.lastOrder, customer: req.session.user});
})




module.exports = router;
