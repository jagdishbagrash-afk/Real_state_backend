const TeamMember = require("../Model/TeamMember");
const { deleteFile } = require('../Utill/S3.js');
const { S3Client, DeleteObjectCommand } = require("@aws-sdk/client-s3");

const s3Client = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});
// Define the UPLOADS_FOLDER

exports.addMember = async (req, res) => {
  try {
    const { name, position } = req.body;
    const fileUrl = req.file ? req.file.location : null;
    if (!name || !position) {
      return res.status(400).json({
        message: "Name and Position are required",
        status: false,
      });
    }

    // If file uploaded, send it to S3/Spaces
    const member = await TeamMember.create({
      name,
      position,
      imageUrl: req.file.location || "",
    });

    res.status(201).json({
      message: "Team member added successfully",
      member,
      status: true,
    });
  } catch (err) {
    console.error("Error adding member:", err);
    res.status(500).json({ error: err.message, status: false });
  }
};

// Get All Team Members
exports.getMembers = async (req, res) => {
  try {
    const members = await TeamMember.find();
    res.status(200).json({
      data: members,
      message: "Success",
      status: true,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


exports.updateMember = async (req, res) => {
  try {
    const {
      _id, name, position
    } = req.body;

    // Get files (if any new ones uploaded)
    const imageUrl = req.file ? req.file.location : null;

    // Find existing project
    const project = await TeamMember.findById({ _id: _id });
    if (!project) {
      return res.status(404).json({ status: false, message: "Team not found" });
    }

    // Update text fields
    project.name = name || project.name;
    project.position = position || project.position;
    // Update images only if new ones uploaded
    if (imageUrl) project.imageUrl = imageUrl;
    await project.save();

    res.json({
      status: true,
      message: "Teams updated successfully",
      data: project,
    });
  } catch (err) {
    console.error("Error updating project:", err);
    res.status(400).json({ status: false, message: err.message });
  }
};

// Delete a Team Member
exports.deleteMember = async (req, res) => {
  try {
    const { _id } = req.body;
    console.log("_id", _id)
    if (!_id) {
      return res.status(400).json({ message: "Member ID is required", status: false });
    }
    const deleted = await TeamMember.findByIdAndDelete(_id);
    if (deleted?.imageUrl) {
      const deleteResponse = await deleteFile(deleted.imageUrl);
      if (!deleteResponse.status) {
        return errorResponse(res, "Failed to delete file from Cloud", 500, false);
      }
    }
    if (!deleted) {
      return res.status(404).json({ message: "Member not found", status: false });
    }

    res.status(200).json({
      message: "Team member deleted successfully",
      status: true,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.DeleteAWSImages = async (req, res) => {
  try {
    let { images } = req.body;
    // ensure array
    if (!Array.isArray(images)) {
      images = [images];
    }
    // extract keys from urls
    const keys = images.map(url => url.split(".com/")[1]);

    // delete each
    for (const key of keys) {
    const record =  await s3Client.send(
        new DeleteObjectCommand({
          Bucket: process.env.S3_BUCKET_NAME,
          Key: key
        })
      );
      console.log("record" ,record)
    }

    return res.status(200).json({
      status: true,
      message: "Images deleted successfully"
    });

  } catch (err) {
    return res.status(500).json({
      status: false,
      error: err.message
    });
  }
};

