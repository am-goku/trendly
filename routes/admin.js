const express = require('express');
const router = express.Router();

//importing controllers
const adminController = require('../controllers/admin-controller/adminController')
const loginController = require('../controllers/admin-controller/loginController');
const productController = require('../controllers/product-controller/productController');
const userMangController = require('../controllers/admin-controller/userManageController');
const categoryController = require('../controllers/product-controller/categoryController');
const productManage = require('../controllers/admin-controller/productManageController');
const orderManagement = require('../controllers/admin-controller/orderManageController');
const couponManagement = require('../controllers/admin-controller/couponManageController');
const bannerManagement = require('../controllers/admin-controller/bannerManageController');
const salesManageController = require('../controllers/admin-controller/salesManageController');

//importing middlewares
const upload = require('../middlewares/multer');


//multer functions
// const multer = require('multer');
// const fileStorage = multer.diskStorage({
//     destination: (req, file, cb) => {
//       cb(null, './uploads');
//     },
//     filename: (req, file, cb) => {
//       const timestamp = Date.now();
//       const newFilename = `${timestamp}_${file.originalname}.jpg`;
//       cb(null, newFilename);
//     },
//     fileFilter: (req, file, cb) => {
//         if (file.mimetype !== 'image/jpeg' && file.mimetype !== 'image/png') {
//           cb(new Error('Only jpeg and png files are allowed'));
//           return;
//         } else {
//           cb(null, true);
//           return;
//         }
//     }
//   });
// const upload = multer({storage: fileStorage});




/* GET users listing. */
router.get('/', adminController.loginCheck, salesManageController.getDashboard );


//login
router.get('/login', loginController.getLogin );

router.post('/login', loginController.postLogin);

router.get('/forgotpassword', loginController.forgotPassword);

router.post('/resetPassword', loginController.resetPassword);

// stuck at otpsend, and forgot to put cofirm otp page in between phone and resend otp

//Products
router.get('/addproducts', productController.getAddProduct);

router.post('/addProducts', upload.array('productImage'), productController.postAddProduct );


router.get('/products', adminController.loginCheck, productManage.showProducts );

router.get('/products/edit/:id', adminController.loginCheck, productManage.getEditProduct );

router.post('/products/edit/:id', upload.array('productImage'), productManage.postEditProduct );




//Categories
router.get('/categories', adminController.loginCheck, categoryController.allCategories);


router.post('/addCategory', adminController.loginCheck, categoryController.addCategory);

router.get('/category/delete/:id', adminController.loginCheck, categoryController.deleteCategory);



//order management
router.get('/orders', adminController.loginCheck, orderManagement.showOrders)

router.get('/orders/details', adminController.loginCheck, orderManagement.getOrderDetails);

router.get('/manageOrder', adminController.loginCheck, orderManagement.manageOrder);



//coupon management
router.get('/coupon', adminController.loginCheck, couponManagement.getCoupon);
router.post('/add-coupon', couponManagement.addCoupon );
router.get('/removeCoupon', couponManagement.removeCoupon );


//banner management
router.get('/banner', adminController.loginCheck, bannerManagement.getBanner);

router.get('/addBanner', adminController.loginCheck, (req, res)=> {
    res.render('admin/addBanner',{admin:true})
})

router.post('/addBanner', adminController.loginCheck, upload.single('bannerImage'), bannerManagement.addBanner);

router.post('/removeBanner', adminController.loginCheck, bannerManagement.removeBanner);



///////////// CUSTOMER MANAGEMENT //////////////////////////////////
router.get('/customers',adminController.loginCheck, adminController.getCustomers );

router.get('/customers/edit/:id',adminController.loginCheck, userMangController.editUser );

router.post('/customers/edit/:id', adminController.loginCheck, userMangController.updateUser );

router.post('/customers/block', adminController.loginCheck, userMangController.blockUnblockUser ); //block nd unblock customers




router.post('/customers/block', (req, res)=> {
    res.redirect('/admin');
    
});


//admin dashboard management
 router.post('/getSales', salesManageController.getSales )
//  router.post('/getRevenue' )
//  router.post('/getCustomers' )

router.post('/getPaymentMethod', salesManageController.getPaymentMethod);

router.post('/updateGraph', salesManageController.salesForGraph)















//logout
router.get('/logout', loginController.getLogout);







router.get('/popup', (req, res) => {
res.render('admin/popup');
})






module.exports = router;
