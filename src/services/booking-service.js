const axios = require("axios");
const db = require("../models");
const { Server_config } = require("../config");
const AppError = require("../utils/errors/AppError");
const { StatusCodes } = require("http-status-codes");
const BookingRepository = require("../repository/booking-repository");
const{Enum}=require('../utils/common/index');
const {BOOKED , CANCELLED , INITIATED , PENDING }=Enum.BOOKING_STATUS


const bookingRepository = new BookingRepository();

async function createBooking(data) {
  const transaction = await db.sequelize.transaction();

  try {
    const flight = await axios.get(
      `${Server_config.FLIGHT_SERVICE}/api/v1/flights/${data.flightId}`
    );
    const flightData = flight.data.Correct_Res.data;

    if (flightData.totalSeats < data.noOfSeats) {
      throw new AppError(
        "Not Enough seats Available ",
        StatusCodes.BAD_REQUEST
      );
    }

    const billingAmount = data.noOfSeats * flightData.price;
    console.log(billingAmount);

    const bookingPayload = { ...data, totalCost: billingAmount };

    const booking = await bookingRepository.createBookings(
      bookingPayload,
      transaction
    );

    // Now after making bill we will reserve seats in our flight so again axios api call   -
    // u can also do google how to do patch for axios-
    await axios.patch(
      `${Server_config.FLIGHT_SERVICE}/api/v1/flights/${data.flightId}/seats`,
      { seat: data.noOfSeats }
    );

    await transaction.commit();
    return booking;
  } catch (error) {
    await transaction.rollback();
    throw error;
  }
}


async function createPayments(data){

    const transaction = await db.sequelize.transaction();

    try{
    const bookingDetails=await bookingRepository.getBooking(data.bookingId , transaction);
    // console.log(bookingDetails);

    const bookingTime = new Date(bookingDetails.createdAt);
    const currentTime = new Date();

    if(currentTime- bookingTime  > 60000){

        const updatebooking= await bookingRepository.updateBooking({status:CANCELLED},data.bookingId,transaction);
        throw new AppError( "Booking Time Expired", StatusCodes.INTERNAL_SERVER_ERROR);        
    }

    if(bookingDetails.userId != data.userId){
        
        throw new AppError( "User who started booking process and payment are not same ", StatusCodes.BAD_REQUEST );
    }


    if(bookingDetails.totalCost != data.totalCost){

        throw new AppError( "Total Cost u are paying and booking cost are not same ", StatusCodes.BAD_REQUEST );
    }

    const updatebooking= await bookingRepository.updateBooking({status:BOOKED},data.bookingId,transaction);

await transaction.commit();
    }

    catch(error){

        await transaction.rollback();
        throw error;
    }

}


module.exports = {
  createBooking,
  createPayments,
};
