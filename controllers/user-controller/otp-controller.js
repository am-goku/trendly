// Download the helper library from https://www.twilio.com/docs/node/install
// Find your Account SID and Auth Token at twilio.com/console
// and set the environment variables. See http://twil.io/secure
const dotenv = require('dotenv');
dotenv.config()
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = require('twilio')(accountSid, authToken);


var countryCode = '+91';


const otpMethods = {
    resendOtp: (req, res) => {
        userData = req.query;
        otpMethods.sendOtp(userData);
        console.log('userData : '+userData.phone);
        res.json({status: true})
       
    },

    sendOtp: (userData) => {
        return new Promise((resolve, reject) => {
            client.verify.v2.services('VA70670a70daeef40499be2ada16f96f48')
                .verifications
                .create({to: countryCode+userData.phone, channel: 'sms'})
                .then((verification) => {
                    console.log(verification.status);
                    resolve(verification.status);
                });
        })
    },


    verifyOtp: (userData) => {
        return new Promise((resolve, reject) => {
            client.verify.v2.services('VA70670a70daeef40499be2ada16f96f48')
            .verificationChecks
            .create({ to: countryCode+userData.phone, code: userData.otp })
            .then((verification_check) =>{ 
                console.log(verification_check.status);
                resolve(verification_check.valid)
            });
        })
    },

    
}

module.exports = otpMethods;