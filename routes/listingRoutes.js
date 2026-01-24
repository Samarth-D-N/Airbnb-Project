const express=require("express");
const router=express.Router();
const wrapAsync=require("../utils/wrapAsync.js");
const ExpressError=require("../utils/ExpressError.js");
const {listingSchema}=require("../schema.js");
const {isLoggedin}=require("../middleware.js");
const {isOwner}=require("../middleware.js");
const listingController=require("../controllers/listingCont.js");
const multer  = require('multer');
const {storage}=require("../cloudConfig.js");
const upload = multer({ storage});


const validateListing = (req, res, next) => {
  const { error } = listingSchema.validate(req.body); 

  if (error) {
    let errMsg = error.details.map((el) => el.message).join(",");
    throw new ExpressError(400, errMsg);
  } else {
    next();
  }
};


// CREATE new listing
router.post(
  "/",
  isLoggedin,
  upload.single("listing[image]"), // BEFORE controller
 
  wrapAsync(listingController.createListing)
);



router.get("/",wrapAsync(listingController.index));


//update
router.put("/:id",isLoggedin,isOwner,  upload.single("listing[image]"),
wrapAsync(listingController.updateListing));

//editform
router.get("/:id/edit",isLoggedin,isOwner,wrapAsync(listingController.renderEditForm));

//new form
router.get("/new",isLoggedin,listingController.renderNewForm);

//show route
router.get("/:id",wrapAsync(listingController.showListing));

//delete
router.delete("/:id",isLoggedin,isOwner,wrapAsync(listingController.destroyListing));

//create listing
router.post("/",isLoggedin,validateListing, wrapAsync(listingController.createListing));

module.exports=router;