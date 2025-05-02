const express = require('express');
const router = express.Router({ mergeParams: true });
const bookings = require('../controllers/bookingg');
const Listing = require("../models/listing");
const wrapAsync=require("../utils/wrapAsync");
const listingController=require("../controllers/listingg.js");
const Review = require("../models/review");
const {isLoggedIn,isOwner,validateListing}=require("../middleware.js");
const multer  = require("multer");
const {storage}=require("../cloudConfig.js");
const upload = multer({ storage:storage });

router.get('/listings/:id/book', bookings.showBookingForm);
router.post("/listings/:id/bookings", isLoggedIn, bookings.createBooking);
router.get("/listings/:id/showbookings", isLoggedIn, bookings.showOwnerBookings);
router.get("/profile", isLoggedIn, bookings.renderProfile);
router.post("/profile/bookings/:id/cancel", isLoggedIn, bookings.cancelBooking);

router.get("/profile/bookings/:id/receipt", isLoggedIn, bookings.downloadReceipt);


module.exports = router;
