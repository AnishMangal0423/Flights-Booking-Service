const express=require('express')
const router=express.Router();
const {Info}=require('../../controllers');
const airplane_routes=require('./airplane-routes');
const booking_routes= require('./booking-routes')

router.get('/info' , Info);
router.use('/airplanes' , airplane_routes);
router.use('/bookings' , booking_routes)

module.exports=router



