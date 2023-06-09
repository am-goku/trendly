//importing models
const banner = require('../../models/banner-model');

module.exports = {
    addBanner: (bannerDetails, image) => {
        try {
            return new Promise((resolve, reject)=> {
                banner.create({
                    title: bannerDetails.name,
                    subTitle: bannerDetails.subTitle,
                    button: bannerDetails.button,
                    images: image.filename
                }).then((response) => {
                    resolve(response);
                }).catch((error) => {
                    console.log('Error in creating banner (Helper)', error);
                    resolve({error: true})
                })
            })
        } catch (err) {
            console.log('Error adding banner outside try ::', err);
        }
    },


    getBanner: ()=> {
        return new Promise((resolve, reject)=> {
            banner.find({}).lean().then((response)=> {
                resolve(response);
            }).catch((error) => {
                console.log('Error in getting banners(helper)');
                resolve({error: true});
            })
        })
    },

    removeBanner: (bannerId) => {
        return new Promise ((resolve, reject) => {
            banner.deleteOne({_id: bannerId}).then((response)=> {
                if(response){
                    resolve({status: true});
                } else {
                    resolve({status: false});
                }
            }).catch((err)=> {
                console.log('Error removing banner (helper)', err);
                resolve({status: false})
            })
        })
    }
}