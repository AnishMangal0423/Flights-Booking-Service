const CrudRepository = require("./crud_repository");
const { Booking } = require("../models");
const{StatusCodes}=require('http-status-codes')
const AppError = require("../utils/errors/AppError");


class BookingRepository extends CrudRepository {
  constructor() {

    console.log(Booking);

    super(Booking);
  }

// Making another fn because of transaction-

  async createBookings(data , transaction){

    try {
      const response = await Booking.create(data , {transaction:transaction});
      return response;

    } catch (error) {
      console.log(error)
      console.log("error in booking repository");
      throw error;

    }
  }

  
  async getBooking(id, transaction) {
  

    const response = await  Booking.findByPk(id, {transaction:transaction});
    console.log("resss "+ response)
    if(!response){

      throw new AppError(" Somethng Went Wrong cannot get booking details .. " , StatusCodes.NOT_FOUND);
     }

    return response;

    }




    async updateBooking(data, id, transaction) {
      try {
        const response = await Booking.update(data, {
          where: {
            id: id,
          },
        } , {transaction: transaction});
        return response;
      } catch (error) {
        console.log("error in Booking repository");
      }
    }
  
  


}


module.exports = BookingRepository;
