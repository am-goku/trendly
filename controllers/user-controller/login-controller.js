const bcrypt = require('bcrypt');
const session = require('express-session');
const loginHelper = require('../../helpers/userHelpers/loginHelper');


// additional variables
let errMsg = false;



let loginController = {

    

    getLogin: (req, res, next) => {
        try{
                console.log('hello');
                let blocked = req.session.blocked;
                console.log(errMsg, blocked);
                res.render('shop/login', { title: 'Login', errMsg, blocked, loginPage:true})
                errMsg = false, req.session.blocked = false, req.session.err = false;
            
        } catch(err){
            console.log(err);
        }
    },
        

    postLogin: async (req, res, next) => {
        let userData = req.body;
        loginHelper.doLogin(userData).then((response) => {
            if(response.status){
                req.session.loggedIn = true;
                let abc = response.user
                // req.session.user = response.user;
                req.session.user = {
                    _id: response.user._id,
                    name: response.user.name,
                    phone: response.user.phone,
                    password: response.user.password,
                    __v: response.user.__v,
                    email: response.user.email,
                    blocked: response.user.blocked,
                    activeStatus: response.user.activeStatus,
                    cartCount : response.userCart ? response.userCart.items.length : 0
                    
                };
                console.log(response.user)
                console.log('session user::', req.session.user);
                loginHelper.setActiveStatus(response.user, req.session.loggedIn);
                res.redirect('/');
            } else {
                errMsg = true;
                res.redirect('/login');
            }
        })
    },


    logout: (req, res, next) => {
        req.session.loggedIn = false;
        let user = req.session.user;
        loginHelper.setActiveStatus(user, req.session.loggedIn);
        req.session.user = null;
        res.redirect('/');
    },



}



module.exports = loginController;