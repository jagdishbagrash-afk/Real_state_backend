const mongoose = require("mongoose");

const jobSchema = new mongoose.Schema({
  title: String,
  content: String,
  slug: String,
  location: String,
  image: String,
  employment_type: String,
  experience: String,
   Skills: String, 
}, { timestamps: true });

module.exports = mongoose.model("jobadd", jobSchema);
