const express=require('express');

const router=express.Router();
const {makeBooking}=require('../../controllers')


router.post('/' , makeBooking.makeBookings);

router.post('/payments', makeBooking.makePayments)


module.exports=router;