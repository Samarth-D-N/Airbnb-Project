const Listing=require("../models/listing");

module.exports.index=async(req,res)=>{
const allListings=await Listing.find({});
res.render("listings/index.ejs",{allListings});
};

module.exports.renderNewForm=(req,res)=>{
  res.render("listings/newListing.ejs");
};

module.exports.showListing=async (req,res)=>{
let {id}=req.params;
let value=await Listing.findById(id).populate({
  path: "reviews",
  populate: {
    path: "author",
  },
}).populate("owner");
if(!value){
  req.flash("error","This Listing Does not Exist!!");
res.redirect("/listings");
}
else{
  res.render("listings/show.ejs",{value});

}
};

module.exports.createListing=async (req, res, next) => {
  let url=req.file.path;
  let filename=req.file.filename;
  let newList = new Listing(req.body.listing);
  newList.owner=req.user._id;
  newList.image={url,filename};
  await newList.save();
  req.flash("success","New Listing Created!");
  res.redirect("/listings");

};

module.exports.renderEditForm=async(req,res)=>{
  let {id}=req.params;
const editlist=await Listing.findById(id);

// let originalImageUrl = editlist.image.url;
// originalImageUrl = originalImageUrl.replace("/upload", "/upload/,w_250");
res.render("listings/edit.ejs",{editlist});

};


module.exports.updateListing = async (req, res) => {
  let { id } = req.params;

  let listing = await Listing.findByIdAndUpdate(
    id,
    { ...req.body.listing }
  );

  if (typeof req.file !== "undefined") {
    let url = req.file.path;
    let filename = req.file.filename;
    listing.image = { url, filename };
    await listing.save();
  }

  req.flash("success", "Listing Updated!");
  res.redirect(`/listings/${id}`);


};


module.exports.destroyListing=async(req,res)=>{
let {id}=req.params;
let delVal=await Listing.findByIdAndDelete(id);
console.log(delVal);
  req.flash("success","Listing Deleted!");
res.redirect("/listings");
};