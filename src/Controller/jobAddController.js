const Job = require("../Model/JobAdd");
const { deleteFile } = require("../Utill/S3");

// ✅ Create a new Job
exports.createJob = async (req, res) => {
  try {
    const {
      title,
      content,
      location,
      employment_type,
      experience,
      Skills,

    } = req.body;

    if (!title || !location || !employment_type) {
      return res.status(400).json({ error: "Title, location and job type are required." });
    }

    const job = await Job.create({
      title,
      slug: title.toLowerCase().replace(/\s+/g, '-'),
      location,
      content,
      experience,
      Skills,
      employment_type,
      image: req.file ? req.file.location : "",
    });

    res.status(201).json({
      success: true,
      message: "Job added successfully.",
      data: job,
    });
  } catch (err) {
    console.error("Create Job Error:", err);
    res.status(500).json({
      success: false,
      error: "Server error while creating job.",
      details: err.message,
    });
  }
};

// ✅ Get all Jobs
exports.getJobs = async (req, res) => {
  try {
    const jobs = await Job.find();
    res.status(200).json({
      success: true,
      message: "All jobs fetched successfully.",
      count: jobs.length,
      data: jobs,
    });
  } catch (err) {
    console.error("Get Jobs Error:", err);
    res.status(500).json({
      success: false,
      error: "Server error while fetching jobs.",
      details: err.message,
    });
  }
};

// ✅ Get single Job by ID
exports.getJob = async (req, res) => {
  try {
    const { slug } = req.params;

    // Correct usage: pass an object as filter
    const job = await Job.findOne({ slug: slug });

    if (!job) {
      return res.status(404).json({
        success: false,
        message: "Job not found.",
      });
    }

    res.status(200).json({
      success: true,
      message: "Job fetched successfully.",
      data: job,
    });
  } catch (err) {
    console.error("Get Job Error:", err);
    res.status(500).json({
      success: false,
      error: "Server error while fetching job.",
      details: err.message,
    });
  }
};



// ✅ Update Job
exports.updateJob = async (req, res) => {
  try {
    const {
      _id,
      title,
      location,
      job_type,
      experience,
      about,
      responsibilities,
      qualifications,
      offers,
    } = req.body;

    if (!_id) {
      return res.status(400).json({ success: false, error: "Job ID is required for update." });
    }

    const updatedJob = await Job.findByIdAndUpdate(
      _id,
      {
        title,
        location,
        job_type,
        experience,
        about,
        responsibilities,
        qualifications,
        offers,
      },
      { new: true }
    );

    if (!updatedJob) {
      return res.status(404).json({ success: false, message: "Job not found." });
    }

    res.status(200).json({
      success: true,
      message: "Job updated successfully.",
      data: updatedJob,
    });
  } catch (err) {
    console.error("Update Job Error:", err);
    res.status(500).json({
      success: false,
      error: "Server error while updating job.",
      details: err.message,
    });
  }
};

// ✅ Delete Job
exports.deleteJob = async (req, res) => {
  try {
    const job = await Job.findByIdAndDelete(req.body._id);
    if (job?.image) {
      const deleteResponse = await deleteFile(job.image);
      if (!deleteResponse.status) {
        return errorResponse(res, "Failed to delete file from Cloud", 500, false);
      }
    }

    if (!job) {
      return res.status(404).json({ success: false, message: "Job not found." });
    }

    res.status(200).json({
      success: true,
      message: "Job deleted successfully.",
    });
  } catch (err) {
    console.error("Delete Job Error:", err);
    res.status(500).json({
      success: false,
      error: "Server error while deleting job.",
      details: err.message,
    });
  }
};
