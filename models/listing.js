const mongoose=require("mongoose");
const Schema=mongoose.Schema;
const Review=require("./review.js");

const listingSchema=new Schema({
    title:{
        type:String,
        required:true},
    description :String,
    image:{
        url:String,
       filename :String,
        },
    price:Number,
    location:String,
    country :String,
    reviews :[{
        type: Schema.Types.ObjectId,
        ref : "Review",
 } ],
 owner : {
    type : Schema.Types.ObjectId,
    ref :"User",
 },
 geometry :{
    type :{
        type:String,
        enum :['Point'],
       
    },
    coordinates :{
        type :[Number],
        required : true,
    }
 },
 category :{
    type :String,
    enum:["Mountains","Camping","Arctic","Domes","Boat","Farms","Iconic Cities","Rooms","Trending"],
    required :true,
 },
 sustainabilityProject: {
    name: String,
    description: String,
    startDate: Date,
    endDate: Date,
    startTime: String,
    endTime: String
},

});
//momgoose middleware post wala
listingSchema.post("findOneAndDelete",async(listing)=>{
    if(listing){
        await Review.deleteMany({_id : {$in :listing.reviews}});
  
    }
});


const Listing=mongoose.model("Listing",listingSchema);
module.exports=Listing;