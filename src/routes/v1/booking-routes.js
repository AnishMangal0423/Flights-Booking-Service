const express=require('express');

const router=express.Router();
const {makeBooking}=require('../../controllers')


router.post('/' , makeBooking.makeBookings);


module.exports=router;