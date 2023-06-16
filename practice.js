// const today = new Date();
// const year = today.getFullYear();
// const month = String(today.getMonth() + 1).padStart(2, '0');
// const day = String(today.getDate()).padStart(2, '0');
// const dateOnly = `${year}-${month}-${day}`;

// const { type } = require("jquery");



// function genarateOrderNo() {
//     let min = 10000, max = 99999;
//     let randomNo = Math.floor(Math.random() * (max - min + 1)) + min;
//     let OrderNo = 'TDLY'+randomNo;
//     return OrderNo;
// }

// console.log(genarateOrderNo());

let s= 'abc', goal = 'bac';

var buddyStrings = function(s, goal) {
    let a = s.split('');
    let g = goal.split('');
    let flag;
    if(s.length !== goal.length){
        flag = false;
    } else {
        let len = a.length,i=0, j=i+1, temp=a;
        

        while(i<len-1){
            let x=temp[i];
            temp[i]=temp[j];
            temp[j] = x;
            console.log(temp);
            if(temp.join('') == goal){
                flag = true;
                break;
            } else {
                flag = false;
                temp = a;
                if(i <len-2){
                    i++; j=i+1;
                } else {
                    i++; j++;
                }
            }
        }
        return flag;
        
    }
};


console.log(buddyStrings(s, goal));