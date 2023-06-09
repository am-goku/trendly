const dotenv = require('dotenv');
dotenv.config()
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = require('twilio')(accountSid, authToken);


const countryCode = '+91';


const otpMethods = {
    /* `resendOtp` is a function that takes in a request object `req` and a response object `res`. It
    extracts the `userData` from the query parameters of the request object and calls the `sendOtp`
    function of the `otpMethods` object with the `userData`. It then logs the `userData.phone` to
    the console and sends a JSON response with a `status` property set to `true`. */
    resendOtp: (req, res) => {
        userData = req.query;
        otpMethods.sendOtp(userData);
        console.log('userData : '+userData.phone);
        res.json({status: true})
       
    },

    /* `sendOtp` is a function that takes in a `userData` object as a parameter. It creates a new
    Promise that wraps the Twilio API call to send an SMS verification code to the phone number
    specified in the `userData` object. The `client.verify.v2.services` method is used to specify
    the Twilio Verify service to use, and the `create` method is used to initiate the verification
    process by sending an SMS message to the specified phone number. The `verification.status` is
    logged to the console, and the Promise is resolved with the `verification.status` value. */
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


    /* `verifyOtp` is a function that takes in a `userData` object as a parameter. It creates a new
    Promise that wraps the Twilio API call to verify an SMS verification code sent to the phone
    number specified in the `userData` object. The `client.verify.v2.services` method is used to
    specify the Twilio Verify service to use, and the `verificationChecks.create` method is used to
    initiate the verification process by checking the verification code sent to the specified phone
    number. The `verification_check.status` is logged to the console, and the Promise is resolved
    with the `verification_check.valid` value, which indicates whether the verification code is
    valid or not. */
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