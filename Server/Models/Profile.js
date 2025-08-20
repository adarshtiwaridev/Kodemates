const mongoose = require("mongoose");

const profileSchema = new mongoose.Schema({
  
   gender: {
    type: String,
    required: true,
    enum: ["male" ,"female","Not Specified"],
    default: ""
    },
    dateOfBirth: { type: Date, required: true ,trim:true },
    address: { type: String, required: true ,trim:true },
    contactNumber: { type: String, required: true ,trim:true },

    
});
const profile = mongoose.model("profile", profileSchema);
module.exports = profile;
