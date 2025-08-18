const mongoose = require("mongoose");

const TagsSchema = new mongoose.Schema({
    name:
    {
        type: String,
        required: true,
        trim: true,
        unique: true
    },
    description: {
        type: String,
        required: true,
        trim: true
    },
    courses: [{
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "Course"
    }],

    
});
const Tags = mongoose.model("Tags",TagsSchema);
module.exports = Tags;
