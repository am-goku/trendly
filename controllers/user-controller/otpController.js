const dotenv = require('dotenv');
dotenv.config()
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const verifySid = process.env.TWILIO_VERIFY_SID
const client = require('twilio')(accountSid, authToken);


const countryCode = '+91';


const otpMethods = {
    /* `resendOtp` is a function that takes in a request object `req` and a response object `res`. It
    extracts the `userData` from the query parameters of the request object and calls the `sendOtp`
    function of the `otpMethods` object with the `userData`. It then logs the `userData.phone` to
    the console and sends a JSON response with a `status` property set to `true`. */
    resendOtp: (req, res) => {
        try {
            userData = req.query;
            otpMethods.sendOtp(userData).then((response) => {
                res.json({ status: true })
            }).catch((err) => {
                res.json({status:false})
            })
        } catch (error) {
            res.json({ status: false })
        }
    },

    /* `sendOtp` is a function that takes in a `userData` object as a parameter. It creates a new
    Promise that wraps the Twilio API call to send an SMS verification code to the phone number
    specified in the `userData` object. The `client.verify.v2.services` method is used to specify
    the Twilio Verify service to use, and the `create` method is used to initiate the verification
    process by sending an SMS message to the specified phone number. The `verification.status` is
    logged to the console, and the Promise is resolved with the `verification.status` value. */
    sendOtp: (userData) => {
        return new Promise((resolve, reject) => {
            client.messages.create({
              body: "Hii sending from gokul",
              messagingServiceSid: "MGe592e6b3868e282ce1dd58e85e5df22b",
              to: countryCode+userData?.phone,
            }).then((messages => {
                console.log(messages)
                resolve(messages.status)
            })).catch((err) => {
                console.log("Error sending OTP::", err)
            })
            // client.verify.v2
            //   .services(verifySid)
            //   .verifications.create({
            //     to: countryCode + userData.phone,
            //     channel: "sms",
            //   })f
            //   .then((verification) => {
            //     console.log(verification.status);
            //     resolve(verification.status);
            //   })
            //   .catch((err) => {
            //         console.log("Error sending OTP::", err)
            //   });
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
            client.verify.v2.services(verifySid)
            .verificationChecks
            .create({ to: countryCode+userData.phone, code: userData.otp })
            .then((verification_check) =>{ 
                console.log(verification_check.status);
                resolve(verification_check.valid)
            }).catch((error) =>{
                reject(error);
            })
        })
    },
}

module.exports = otpMethods;