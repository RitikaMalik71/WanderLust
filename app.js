if(process.env.NODE_ENV!="production"){
    require('dotenv').config();
}


const express=require("express");
const app=express();
const path=require("path");
const mongoose=require("mongoose");
const ExpressError=require("./utils/ExpressError");

const methodOverride = require("method-override");
const ejsMate=require("ejs-mate");
const listingsRouter=require("./routes/listings.js");
const reviewsRouter=require("./routes/reviews.js");
const bookingsRouter = require('./routes/bookings');


const session=require("express-session");
const flash=require("connect-flash");
const passport=require("passport");
const localStrategy=require("passport-local");
const userRouter=require("./routes/User.js");
const User = require("./models/user.js");
const searchRouter=require("./routes/search.js");
const Mongostore=require("connect-mongo");
const dburl=process.env.ATLASDB_URL;

const store=Mongostore.create({
    mongoUrl:dburl,
    crypto:{
        secret :process.env.SECRET
    },
    touchAfter: 24*3600,
});

store.on("error",()=>{
    console.log("Error in MONGO SESSION STORE",err)
});

const sessionOptions={
    store:store,
    secret:process.env.SECRET,
    resave:false,
    saveUninitialized:true,
    cookie :{
        expires:Date.now()+7*24*60*60*1000,
        maxAge :7*24*60*60*1000,
        httpOnly :true,
    },
};

app.use(express.static(path.join(__dirname, 'public')));
app.use(session(sessionOptions));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
passport.use(new localStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());//store the user information into session
passport.deserializeUser(User.deserializeUser());//to remove the user  information after completing session

app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));
app.use(express.urlencoded({extended:true}));
app.use(methodOverride("_method"));
app.engine("ejs",ejsMate);




main().then(()=>{
    console.log("connection successful");
}).catch(err => console.log(err));




async function main() {
  await mongoose.connect(dburl);
};







app.get("/demouser",async(req,res)=>{
    let fakeuser= new User({
email : "student@gmail.com",
username : "delta-student"
    });
    let registerduser= await User.register(fakeuser,"helloworld");
    res.send(registerduser);
});
app.get("/",(req,res)=>{
    res.redirect("/listings");
    });app.get("/",(req,res)=>{
        res.redirect("/listings");
        });


app.use ((req,res,next)=>{
    res.locals.success=req.flash("success");
    res.locals.error=req.flash("error");
    res.locals.currUser=req.user;
    console.log(res.locals.success);
    next();
})

app.use("/listings",listingsRouter);
app.use("/listings/:id/reviews",reviewsRouter);
app.use("/",userRouter);
app.use(bookingsRouter);
app.use("/search",searchRouter);



//routes doesnt match with  any of above routes 
app.all("*",(req,res,next)=>{
    next(new ExpressError(404,"Page Not found!"));
});
app.use((err,req,res,next)=>{
    let{statusCode=500,message="Something went wrong"}=err;
    res.status(statusCode).render("error.ejs",{message});
    console.log(err);
    //res.status(statusCode).send(message);
});

app.listen(8080,()=>{
    console.log("server is listening");
});