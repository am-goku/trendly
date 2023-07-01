//importing helpers
const salesHelper = require('../../helpers/adminHelpers/salesHelper');

module.exports = {
    getDashboard: (req, res, next) => {
        salesHelper.showSales().then((todaySales)=> {
            res.render('admin/dashboard', {todaySales, admin: req.session.admin});
        }).catch((err)=> {
            console.log('Error in getting dashords', err);
        })
    },


    getSales: (req, res, next) => {
        const time = req.body.time;
        salesHelper.getSales(time).then((sales)=> {
            res.status(200).json({sales});
        }).catch((err)=> {
            console.log('error getting sales in controller', err);
            res.status(200).json({error: true});
        })
    },

    getPaymentMethod: (req, res, next) => {
        const time = req.body.time;
        salesHelper.getSales(time).then((sales)=>{
            let razorpay = 0, cod = 0, others = 0;
            for(let i=0; i<sales.length; i++){
                if(sales[i].order.paymentMethod == 'razorpay'){
                    razorpay ++;
                } else if(sales[i].order.paymentMethod == 'cod'){
                    cod ++;
                } else {
                    others ++;
                }
            }
            res.status(200).json({razorpay, cod, others});
        })
    },


    salesForGraph: (req, res) => {
        const time = req.body.time;
        salesHelper.getSales(time).then((sales) => {
            const totalSales = sales.length;
            let salesDate = [], revenue =[];
            for(let i=0; i<totalSales; i++) {
                salesDate.push(sales[i].order.date);
                revenue.push(sales[i].order.totalAmount);
            }

            res.status(200).json({salesDate: salesDate, revenue: revenue, totalSales: totalSales});
        })
    }





}