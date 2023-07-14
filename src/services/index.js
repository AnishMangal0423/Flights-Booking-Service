const createAirpalne=require('./airplane_service');

module.exports={

    airplane_Service:createAirpalne,
    booking_Service:require('./booking-service')
}