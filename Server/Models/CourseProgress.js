const mongoose = require("mongoose");

const courseSchema = new mongoose.Schema({
    courseId: { type: mongoose.Schema.Types.ObjectId, required: true, unique: true ,ref:"courses"},
    completedVideos: {
        type :mongoose.Schema.type.ObjectId,
        ref: "SubSection",

    }
,
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true, trim: true },

    
});
const CourseProgress  = mongoose.model("CourseProgress", courseSchema);
module.exports = CourseProgress;
