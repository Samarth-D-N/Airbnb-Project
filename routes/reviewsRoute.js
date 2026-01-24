const express=require("express");
const router=express.Router({mergeParams:true});
const wrapAsync=require("../utils/wrapAsync.js");
const ExpressError=require("../utils/ExpressError.js");
const {reviewSchema}=require("../schema.js");
const Review=require("../models/review.js")
const Listing=require("../models/listing.js");
const { isLoggedin,isReviewAuthor } = require("../middleware.js");
const reveiwController=require("../controllers/reviewCont.js");

const validateReview = (req, res, next) => {
  const { error } = reviewSchema.validate(req.body);
  if (error) {
    throw new ExpressError(400, error.details.map(el => el.message).join(","));
  }
  next();
};

router.post(
  "/",
  isLoggedin,
  validateReview,
  wrapAsync(reveiwController.createReview)
);

//delte  review
router.delete("/:reviewId",isLoggedin,isReviewAuthor,wrapAsync(reveiwController.destroyReview));

module.exports=router;