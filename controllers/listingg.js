
const Listing =require("../models/listing");
const mbxgeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapToken=process.env.MAP_TOKEN;
const axios = require('axios');

const geocodingClient = mbxgeocoding({ accessToken:mapToken });

module.exports.index=async(req,res)=>{
    const allListings=await   Listing.find({});
    res.render("index.ejs",{allListings});
  };
  
  module.exports.renderNewForm=(req,res)=>{
 
    res.render("new.ejs");
}


module.exports.showListing=async (req,res)=>{
    let {id}=req.params;
    const listings=await Listing.findById(id).populate({path :"reviews",populate :{
      path:"author",
    },}).populate("owner");
    if(!listings){
      req.flash("error","Listing you requested for does not exist ");
      res.redirect("/listings");
    }
    console.log(listings);
     // 🌤️ Weather & AQI API Integration
let weather = null;
let aqi = null;
const [lng, lat] = listings.geometry.coordinates;
const apiKey = process.env.OPENWEATHER_API_KEY;

try {
  // Fetch Weather Data
  const weatherRes = await axios.get(`https://api.openweathermap.org/data/2.5/weather`, {
    params: {
      lat: lat,
      lon: lng,
      appid: apiKey,
      units: "metric",
    },
  });
  weather = weatherRes.data;

  // Fetch AQI Data
  const aqiRes = await axios.get(`https://api.openweathermap.org/data/2.5/air_pollution`, {
    params: {
      lat: lat,
      lon: lng,
      appid: apiKey,
    },
  });
  aqi = aqiRes.data.list[0];

} catch (e) {
  console.log("Error fetching weather or AQI:", e.message);
}

    res.render("show.ejs",{listings,weather,aqi});
    };

    module.exports.createListing = async (req, res, next) => {
      try {
        let response = await geocodingClient
          .forwardGeocode({
            query: req.body.listing.location,
            limit: 1,
          })
          .send();
    
        let url = req.file ? req.file.path : null;
        let filename = req.file ? req.file.filename : null;
    
        const newListing = new Listing(req.body.listing);
        newListing.owner = req.user._id;
    
        if (url && filename) {
          newListing.image = { url, filename };
        }
    
        newListing.geometry = response.body.features[0].geometry;
        await newListing.save();
    
        req.flash('success', 'New Listing Created');
        res.redirect('/listings');
      } catch (error) {
        console.error('Error creating listing:', error.message);
        req.flash('error', 'Something went wrong. Please try again.');
        res.redirect('/listings');
      }
    };

    module.exports.renderEditForm=async(req,res)=>{
        let {id}=req.params;
        const listings=await Listing.findById(id);
        if(!listings){
            req.flash("error","Listing you requested for does not exist ");
            res.redirect("/listings");
          }
          let originalImageUrl=listings.image.url;
          originalImageUrl=   originalImageUrl.replace("/upload","/upload/h_100,w_200");
        res.render("edit.ejs",{listings,originalImageUrl});
    };

    module.exports.updateListing=async (req,res)=>{
      try{

    let {id}=req.params;
        
    
    let listing= await Listing.findByIdAndUpdate(id, {...req.body.listing});
    if (req.file) {
      let url = req.file.path;
      let filename = req.file.filename;
      listing.image = { url, filename };
      await listing.save();
    }
    
     req.flash("success"," Listing Updated!");
     res.redirect(`/listings/${id}`);
    }catch (error) {
      console.error('Error updating listing:', error.message);
      req.flash('error', 'Something went wrong. Please try again.');
      res.redirect('/listings');
    }
    };

    module.exports.destroyListing=async (req,res)=>{
    
        let {id}=req.params;
        await Listing.findByIdAndDelete(id);
        console.log("listing deleted");
        req.flash("success","Listing Deleted!");
        res.redirect("/listings");
    };
    module.exports.filterTrending=async(req,res)=>{
      const allListings=await   Listing.find({category: "Trending"});
      res.render("filter.ejs",{allListings});
    };
    module.exports.filterRooms=async(req,res)=>{
      const allListings=await   Listing.find({category: "Rooms"});
      res.render("filter.ejs",{allListings});
    };
    module.exports.filterIconicCities=async(req,res)=>{
      const allListings=await   Listing.find({category: "Iconic Cities"});
      res.render("filter.ejs",{allListings});
    };
    module.exports.filterDomes=async(req,res)=>{
      const allListings=await   Listing.find({category: "Domes"});
      res.render("filter.ejs",{allListings});
    };
    module.exports.filterArctic=async(req,res)=>{
      const allListings=await   Listing.find({category: "Arctic"});
      res.render("filter.ejs",{allListings});
    };
 
    module.exports.filterBoat=async(req,res)=>{
      const allListings=await   Listing.find({category: "Boat"});
      res.render("filter.ejs",{allListings});
    };
    module.exports.filterFarms=async(req,res)=>{
      const allListings=await   Listing.find({category: "Farms"});
      res.render("filter.ejs",{allListings});
    };
    module.exports.filterCamping=async(req,res)=>{
      const allListings=await   Listing.find({category: "Camping"});
      res.render("filter.ejs",{allListings});
    };
    module.exports.filterMountains=async(req,res)=>{
      const allListings=await   Listing.find({category: "Mountains"});
      res.render("filter.ejs",{allListings});
    };
    module.exports.filterAmazingPools=async(req,res)=>{
      const allListings=await   Listing.find({category: "Amazing Pools"});
      res.render("filter.ejs",{allListings});
    };
