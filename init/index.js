const mongoose=require("mongoose");
const Alldata=require("./data.js");
const Listing=require("../models/listing.js");
main().then(()=>{
    console.log("connection successfull");
}).catch(err => console.log(err));

async function main() {
  await mongoose.connect('mongodb://127.0.0.1:27017/airbnb');
}

const initDb = async () => {
  await Listing.deleteMany({});

  Alldata.data = Alldata.data.map((obj) => ({
    ...obj,
    owner: "696fbb118903a8459db2d3a5",
  }));

  await Listing.insertMany(Alldata.data);
  console.log("data was initialized successfully");
};

initDb();
