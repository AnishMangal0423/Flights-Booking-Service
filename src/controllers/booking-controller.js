const {booking_Service}= require('../services')
const { Error_Res, Correct_Res } = require("../utils/common");
const AppError = require("../utils/errors/AppError");

const inMemdb={};

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



async function makePayments(req , res){

    try {
        const idempotencyKey= req.headers['x-idempotency-key'];

        if(!idempotencyKey){

          Error_Res.message = " Idempotency Key is Not present .. ";
    return res.status(404).json({
      Error_Res,
    });
        }

        if(inMemdb[idempotencyKey]){

          Error_Res.message = " Cannot Make Payment Again .. ";
          return res.status(404).json({
            Error_Res,
          });
        }


        const payment = await booking_Service.createPayments({

            userId:req.body.userId,
            totalCost:req.body.totalCost,
            bookingId:req.body.bookingId

        })

        Correct_Res.data = payment;
        inMemdb[idempotencyKey]=idempotencyKey;

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
   makePayments
}