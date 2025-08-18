const mongoose = require("mongoose");

const SubSectionSchema = new mongoose.Schema({

    title :{
        type: String,
        required: true,
        trim: true
    },
    timeduration: {
        type: Number,
        required: true,
        min: 0
    },
    description: {
        type: String,
        required: true,
        trim: true
    },
    videourl: {
        type: String,
        required: true,
        trim: true
    },

    
});
const SubSection  = mongoose.model("SubSection", SubSectionSchema);
module.exports = SubSection;
