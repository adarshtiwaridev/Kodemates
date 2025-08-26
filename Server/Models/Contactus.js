const mongoose = require("mongoose");
const contactusSchema = new mongoose.Schema({
    firstName: { type: String, required: true, trim: true },
    lastName: { type: String, required: true, trim: true },

    email: { type: String, required: true, trim: true },

    message: { type: String, required: true, trim: true },
    createdAt: { type: Date, default: Date.now }
});
const Contactus = mongoose.model("Contactus", contactusSchema);
module.exports = Contactus;