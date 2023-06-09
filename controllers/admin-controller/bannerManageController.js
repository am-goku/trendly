// importing helpers
const bannerHelper = require('../../helpers/adminHelpers/bannerHelper');


module.exports = {
    addBanner: (req, res, next)=> {
        const bannerDetails = {
            name : req.body.name,
            subTitle : req.body.subTitle,
            button : req.body.button,
        };
        
        bannerImage = req.file;

        bannerHelper.addBanner(bannerDetails, bannerImage).then((response)=> {
            if(!response.error){
                res.redirect('/admin/banner');
            } else {
                res.redirect('/admin')
            }
        })
    },

    getBanner: (req, res, next)=> {
        bannerHelper.getBanner().then((banner)=> {
            if(!banner.error) {
                res.render('admin/bannerList', {admin: req.session.admin, banner});
            } else {
                res.redirect('/admin');
            }
        }).catch((err)=> {
            console.log('Error in getting banners(cotroller)', err);
            res.redirect('/admin');
        })
    },


    removeBanner: (req, res, next)=> {
        const bannerId = req.body.bannerId;
        bannerHelper.removeBanner(bannerId).then((response)=> {
            res.status(200).json({status: response.status});
        }).catch((err)=> {
            console.log('error in controller removing banner', err);
            res.status(200).json({status:false});
        })
    }
}