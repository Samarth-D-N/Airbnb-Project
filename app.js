if(process.env.NODE_ENV!="production"){
require('dotenv').config();
}

const express=require("express");
const app=express();
const mongoose=require("mongoose");
const path=require("path");
const port=8080;
const methodOverride=require("method-override");
const ejsMate=require("ejs-mate");
const ExpressError=require("./utils/ExpressError.js");
const listingRouter=require("./routes/listingRoutes.js");
const reviewRouter=require("./routes/reviewsRoute.js");
const userRouter=require("./routes/user.js");
const session=require("express-session");
const MongoStore = require("connect-mongo");
const flash=require("connect-flash");
const passport=require("passport");
const LocalStrategy=require("passport-local");
const User=require("./models/user.js");

app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(methodOverride("_method"));
app.engine("ejs",ejsMate);
app.use(express.static(path.join(__dirname,"public")));

const dbUrl=process.env.ATLASDB_URL;

main().then(()=>{
    console.log("connection successfull");
}).catch(err => console.log(err));

async function main() {
  await mongoose.connect(dbUrl);
}
const store = MongoStore.create({
  mongoUrl: process.env.ATLASDB_URL,
  crypto: {
    secret: process.env.SECRET,
  },
  touchAfter: 24 * 3600,
});

store.on("error", (err) => {
  console.log("ERROR in MONGO SESSION STORE", err);
});

const sessionOptions = {
  store,
  secret: process.env.SECRET,
  resave: false,
  saveUninitialized: true,
  cookie: {
    expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
    maxAge: 7 * 24 * 60 * 60 * 1000,
    httpOnly: true,
  },
};

app.use(session(sessionOptions));
app.use(flash());

app.use(passport.initialize());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
app.use(passport.session());

app.use((req,res,next)=>{
res.locals.success=req.flash("success");
res.locals.error=req.flash("error");
res.locals.currUser=req.user;
next();
});

app.use("/listings",listingRouter);
app.use("/listings/:id/reviews",reviewRouter);
app.use("/",userRouter);

app.use((req, res, next) => {
  next(new ExpressError(404, "Page Not Found"));
});

// Global Error Handler
app.use((err, req, res,next) => {
  const { status = 500, message = "Something went wrong!" } = err;
  res.status(status).render("error.ejs",{message});
});

app.listen(port,()=>{
console.log("Server is listening on port 8080");
});