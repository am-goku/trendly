const session = require('express-session');

const loginHelper = require('../../helpers/adminHelpers/loginHelper');

const otpservice = require('../user-controller/otp-controller');



//admin credentials
const adminCredentials = {
    username: 'amgoku',
    password: '2483',
}

//additional variables
const title = 'Admin Panel';
let errMsg = false;
let admin = true;


module.exports = {

    getLogin: (req, res, next) => {
        if(req.session.admin){
            res.redirect('/admin');
        } else {
            res.render('admin/login', {title, errMsg, admin, notActive: true});
            errMsg = false;
        }
    },

    postLogin: (req, res, next) => {
        let adminData = req.body;
        try{
            loginHelper.postLogin(adminData).then((response) => {
                console.log('its response: ' + response);
                if(response){
                    if(response.password === adminData.password) {
                        req.session.admin = response;
                        res.redirect('/admin');
                    } else {
                        errMsg = true;
                        res.redirect('/admin/login');
                    }
                } else {
                    errMsg = true;
                    res.redirect('/admin/login');
                }
            })
        } catch (err) {
            console.log('post login error: ', err);
        }

    },


    getLogout: (req, res, next) => {
        req.session.admin = false;
        res.redirect('/admin');
    },


    forgotPassword: (req, res, next) => {
        // loginHelper.getAdmin
        let adminData = { phone: '8848876169' }
        otpservice.sendOtp(adminData).then((response) => {
            console.log(response.status);
            res.render('admin/resetPassword', {phoneNumber: adminData.phone, admin:true, notActive: true})
        })
    },

    resetPassword: (req, res, next) => {
        try{
            let adminData = { phone: '8848876169', otp: req.body.otp, password: req.body.password }
            otpservice.verifyOtp(adminData).then((result) => {
                console.log(result);
                if(result) {
                    loginHelper.updatePassword(adminData).then((result) => {
                        res.redirect('/admin');
                    })
                } else {
                    res.render('admin/resetPassword', {phoneNumber: phone, admin, notActive: true, optMsg: 'Invalid OTP'})
                }
            })
        } catch (er) {
            console.log('rest password error: ', er);
        }
    }


    

}