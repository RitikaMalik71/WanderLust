const PDFDocument = require("pdfkit");
const fs = require("fs");
const path = require("path");
const Listing =require("../models/listing");
const mbxgeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapToken=process.env.MAP_TOKEN;
const axios = require('axios');
const geocodingClient = mbxgeocoding({ accessToken:mapToken });
const Booking = require('../models/booking');

module.exports.showBookingForm = async (req, res) => {
    const { id } = req.params;
  const listing = await Listing.findById(id);
  if (!listing) {
    req.flash("error", "Listing not found!");
    return res.redirect("/listings");
  }
  res.render("book.ejs", { listing });
};

module.exports.createBooking = async (req, res) => {
    const { id } = req.params;
    const listing = await Listing.findById(id);
  
    const bookingData = req.body.booking;
    const participate = bookingData.participate === "yes";
    const checkin = bookingData.checkin ? new Date(bookingData.checkin) : null;
    const checkout = bookingData.checkout ? new Date(bookingData.checkout) : null;
  
    const booking = new Booking({
      listing: id,
      user: req.user._id,
      adults: bookingData.adults,
      children: bookingData.children,
      days: bookingData.days,
      checkin: checkin,
      checkout:checkout,
      participateInSustainability: participate,
    });
  
    await booking.save();
    console.log("Saved Booking:", booking);
  
    res.render("confirmation.ejs", { listing, booking });
  };


  
module.exports.renderProfile = async (req, res) => {
  const userId = req.user._id;
  const currentDate = new Date();

  const upcomingBookings = await Booking.find({
    user: userId,
    checkin: { $gte: currentDate },
    cancelled: false,
  }).populate("listing");

  const pastBookings = await Booking.find({
    user: userId,
    checkout: { $lt: currentDate },
  }).populate("listing");

  res.render("profile.ejs", {currUser: {
    username: req.user.username,
    email: req.user.email,
    _id: req.user._id,
  },  upcomingBookings, pastBookings });
};

module.exports.cancelBooking = async (req, res) => {
  const { id } = req.params;

  await Booking.findByIdAndUpdate(id, { cancelled: true });

  req.flash("success", "Booking cancelled successfully!");
  res.redirect("/profile");
};


module.exports.downloadReceipt = async (req, res) => {
  const booking = await Booking.findById(req.params.id).populate("listing");

  if (!booking || booking.user.toString() !== req.user._id.toString()) {
    req.flash("error", "Unauthorized access");
    return res.redirect("/profile");
  }

  const doc = new PDFDocument();
  const filename = `Booking_Receipt_${booking._id}.pdf`;

  res.setHeader("Content-Type", "application/pdf");
  res.setHeader("Content-Disposition", `attachment; filename="${filename}"`);

  doc.fontSize(18).text("Booking Receipt", { align: "center" });
  doc.moveDown();

  doc.fontSize(14).text(`Booking ID: ${booking._id}`);
  doc.text(`Listing: ${booking.listing.title}`);
  doc.text(`Check-in: ${booking.checkin.toDateString()}`);
  doc.text(`Check-out: ${booking.checkout.toDateString()}`);
  doc.text(`Adults: ${booking.adults}`);
  doc.text(`Children: ${booking.children}`);
  doc.text(`Sustainability Participation: ${booking.participateInSustainability ? "Yes" : "No"}`);

  doc.end();
  doc.pipe(res);
};

module.exports.showOwnerBookings = async (req, res) => {
  const listingId = req.params.id;
  const currUserId = req.user._id;
console.log(listingId);
  // Fetch the listing to confirm ownership
  const listing = await Listing.findById(listingId);

  if (!listing) {
    req.flash("error", "Listing not found");
    return res.redirect("/listings");
  }

  // Check if current user is the owner
  if (!listing.owner.equals(currUserId)) {
    req.flash("error", "You are not authorized to view these bookings");
    return res.redirect(`/listings/${listingId}`);
  }

  // Find bookings for this listing
  const bookings = await Booking.find({ listing: listingId }).populate("user");
  res.render("ownerBookings.ejs", { bookings });
};

