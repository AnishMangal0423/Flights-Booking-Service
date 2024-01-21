const express=require('express');

const router=express.Router();
const {makeBooking}=require('../../controllers')


router.get('/info' , makeBooking.info);


module.exports=router;