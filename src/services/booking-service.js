const axios = require("axios");
const db = require("../models");
const { Server_config } = require("../config");
const AppError = require("../utils/errors/AppError");
const { StatusCodes } = require("http-status-codes");
const BookingRepository = require("../repository/booking-repository");
const { Enum } = require("../utils/common/index");
const { BOOKED, CANCELLED, INITIATED, PENDING } = Enum.BOOKING_STATUS;
const {Queue}=require('../config');
const { json } = require("sequelize");

const bookingRepository = new BookingRepository();

async function createBooking(data) {
  
console.log(data)

  const transaction = await db.sequelize.transaction();

  try {

    
    const flight = await axios.get(
      `${Server_config.FLIGHT_SERVICE}/api/v1/flights/${data.flightId}`
    );

    console.log("after" + flight);
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

    // console.log("hii   " + error)
    // await transaction.rollback();
    // throw error;





    console.log("Error occurred:", error);

    // Log the underlying errors if available
    if (error.errors) {
      console.log("Underlying errors:", error.errors);
    }
  
    try {
      await transaction.rollback();
    } catch (rollbackError) {
      console.log("Error during rollback:", rollbackError);
    }
  
    throw error;
  }
}

async function cancelBooking(data) {
  // console.log("jjjii");
  const transaction = await db.sequelize.transaction();

  try {
    const bookingDetails = await bookingRepository.getBooking(
      data.bookingId,
      transaction
    );

    if (bookingDetails.status == CANCELLED || bookingDetails.status == BOOKED) {
      await transaction.commit();

      return true;
    }
    // console.log("noof seats     -->>> " + bookingDetails.noOfSeats);

    await axios.patch(
      `${Server_config.FLIGHT_SERVICE}/api/v1/flights/${bookingDetails.flightId}/seats`,
      { seat: bookingDetails.noOfSeats, dec: false }
    );

    const updatebooking = await bookingRepository.updateBooking(
      { status: CANCELLED },
      data.bookingId,
      transaction
    );

    await transaction.commit();
  } catch (error) {
    await transaction.rollback();
    throw error;
  }
}

async function createPayments(data) {

  const transaction = await db.sequelize.transaction();
  // console.log("data.bokingid", data.bookingId);
  try {
    const bookingDetails = await bookingRepository.getBooking(
      data.bookingId,
      transaction
    );
    // console.log(bookingDetails);

    const bookingTime = new Date(bookingDetails.createdAt);
    const currentTime = new Date();

    if (bookingDetails.userId != data.userId) {
      throw new AppError(
        "User who started booking process and payment are not same ",
        StatusCodes.BAD_REQUEST
      );
    }

    if (bookingDetails.totalCost != data.totalCost) {
      throw new AppError(
        "Total Cost u are paying and booking cost are not same ",
        StatusCodes.BAD_REQUEST
      );
    }

    if (currentTime - bookingTime > 300000) {
      cancelBooking({ bookingId: data.bookingId });
      throw new AppError(
        "Payment Time Expired",
        StatusCodes.INTERNAL_SERVER_ERROR
      );
    }

    const updatebooking = await bookingRepository.updateBooking(
      { status: BOOKED },
      data.bookingId,
      transaction
    );



    const flight = await axios.get(
      `${Server_config.FLIGHT_SERVICE}/api/v1/flights/${bookingDetails.flightId}`
    );
    const flightData = flight.data.Correct_Res.data;

    await Queue.sendData({

      recepientEmail:'anishm0423@gmail.com',
      subject:"flight booked",
      text:` Booking is done for booking id as ${data.bookingId}`
   })


    await transaction.commit();


  } catch (error) {
    console.log("eeerrr ", error);
    await transaction.rollback();
    throw error;
  }
}




async function canceloldBookings(){

  try {


    const currentTime=new Date( Date.now() - 1000*300);
    // console.log(currentTime , bookingRepository.cancelOldBookings())
    const response = await bookingRepository.cancelOldBookings(currentTime)

    return response;
  } catch (error) {
    console.log(error);
    // throw error;
  }
}

module.exports = {
  createBooking,
  createPayments,
  canceloldBookings
};
