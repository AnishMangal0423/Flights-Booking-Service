const CrudRepository = require("./crud_repository");
const { Booking } = require("../models");

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

}

module.exports = BookingRepository;
