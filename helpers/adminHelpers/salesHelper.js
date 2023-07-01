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
function setDate(date) {
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();
    const currentMonth = currentDate.getMonth();
    const firstDateOfMonth = new Date(currentYear, currentMonth, 1);
    const firstDayOfYear = new Date(currentDate.getFullYear(), 0, 1);
    if (date == 'day') {
        currentDate.setHours(0,0,0,0);
        let result = new Date(currentDate);
        return result;
    } else if (date == 'month') {
        return firstDateOfMonth;
    } else {
        return firstDayOfYear;
    }
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

        }).catch((err)=> {
            console.log('Error getting dashboards:', err);
        })
    },


    getSales: (time)=> {
        try{
            const salesDate = setDate(time);
            const salesDateQuery = {
                $gte: salesDate
            }
            return new Promise((resolve, reject) => {
                orderCollection.aggregate([
                    { $unwind: '$order' },
                    { $match: { 'order.date': { $gte: salesDate } } }
                ])                  
                .exec()
                .then((response)=> {
                    resolve(response)
                }).catch((error)=> {
                    console.log(error, 'mdg');
                  })
            });
        } catch(err) {
            console.log('error::', err);
        }
    }

    


}