const mongoose = require("mongoose");

const SectionSchema = new mongoose.Schema({

   SectionName: {
        type: String,
        required: true,
        trim: true
    },
   
    subsections: [{
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "SubSection"
    }],
    courseId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "courses"
    }
    
});
const Section  = mongoose.model("Section", SectionSchema);
module.exports = Section;
