const mongoose = require("mongoose");

const jobSchema = new mongoose.Schema({
  title: String,
  location: String,
  job_type: String,
  experience: String,
  about: String,
  responsibilities: String,
  qualifications: String,
  offers: String,
}, { timestamps: true });

module.exports = mongoose.model("jobadd", jobSchema);
