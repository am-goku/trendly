//importing models
const orderCollection = require('../../models/order-model');

//additional variables
const currentDate = new Date();

//helper functions
function convertdate(cDate, oDate) {
    const cday = cDate.toString().substring(8, 10);
    const cmonth = cDate.toString().substring(5, 7);
    const cyear = cDate.toString().substring(0, 4);
    const cformattedDate = `${cday}- ${cmonth} -${cyear}`;

    const oday = oDate.toString().substring(8, 10);
    const omonth = oDate.toString().substring(5, 7);
    const oyear = oDate.toString().substring(0, 4);
    const oformattedDate = `${oday}- ${omonth} -${oyear}`;

    return [cformattedDate, oformattedDate];
}

module.exports = {
    showSales: ()=> {
        return new Promise(async (resolve, reject)=> {
            const totalOrders = await orderCollection.find({}).lean();
            
            
            let todaySale = 0;
            for (const document of totalOrders) {
                for (const order of document.order) {
                    const dates = convertdate(currentDate, order.date);
                    if (dates[0] === dates[1]) {
                        // for (const product of order.items) {
                        //     todaySale += product.quantity;
                        // }
                        todaySale++;
                    }
                }
            }

            console.log('Todays sales:::', todaySale);

            resolve(todaySale);

        })
    }
}