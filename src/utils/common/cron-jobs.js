const cron =require('node-cron');

const { canceloldBookings}=require('../../services/booking-service')


 function schduleCrons(){

    cron.schedule('*/2 * * * * * ', async ()=>{
        // console.log(canceloldBookings)
           const response = await canceloldBookings()
        //    console.log(response)
    })
}

module.exports=schduleCrons