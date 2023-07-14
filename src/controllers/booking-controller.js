const {booking_Service}= require('../services')
const { Error_Res, Correct_Res } = require("../utils/common");


async function makeBookings(req , res){

    try {
        
        const booking = await booking_Service.createBooking({

            userId:req.body.userId,
            noOfSeats:req.body.noOfSeats,
            flightId:req.body.flightId

        })

        Correct_Res.data = booking;

        return res.json({
          Correct_Res,
        });


    } catch (error) {
        
        // console.log("hiiii  " + error);

    Error_Res.message = " Something went wrong .. ";
    // Error_Res.message=

    Error_Res.Error.description = error.message;

    return res.status(404).json({
      Error_Res,
    });
    }
}

module.exports={
   makeBookings,

}