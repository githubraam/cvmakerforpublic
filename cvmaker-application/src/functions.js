export const  mongoDateFormat = (mongoDate)=>{
    var date = new Date(mongoDate);  
    var d = date.getDate();
    var m = date.getMonth()+1;
    var y = date.getFullYear();

    return d + '/' + m + '/' + y;
}