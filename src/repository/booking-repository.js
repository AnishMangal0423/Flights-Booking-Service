const CrudRepository = require("./crud_repository");
const { Booking } = require("../models");

class BookingRepository extends CrudRepository {
  constructor() {

    console.log(Booking);

    super(Booking);
  }
}

module.exports = BookingRepository;
