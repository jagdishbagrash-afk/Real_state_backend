const TeamMember = require("../Model/TeamMember");
const { uploadFileToSpaces } = require("../Utill/S3.js");
const { deleteFile } = require('../Utill/S3.js');
const { PutObjectCommand } = require('@aws-sdk/client-s3');
const { S3Client } = require('@aws-sdk/client-s3');

const s3Client = new S3Client({
    region: process.env.AWS_REGION,
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    },
});
// Define the UPLOADS_FOLDER
const UPLOADS_FOLDER = "uploads/";

// Create a Team Member

exports.addMember = async (req, res) => {
  try {
    const { name, position  } = req.body;
    const  fileUrl = req.file ? req.file.location : null;
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

// Update a Team Member
exports.updateMember = async (req, res) => {
  try {
    const { _id, name, imageurl, position } = req.body;

    if (!_id) {
      return res.status(400).json({ message: "Member ID is required", status: false });
    }

    const updated = await TeamMember.findByIdAndUpdate(
      _id,
      { name, imageurl, position },
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ message: "Member not found", status: false });
    }

    res.status(200).json({
      message: "Team member updated successfully",
      data: updated,
      status: true,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Delete a Team Member
exports.deleteMember = async (req, res) => {
  try {
    const { _id } = req.body;

    if (!_id) {
      return res.status(400).json({ message: "Member ID is required", status: false });
    }
    const deleted = await TeamMember.findByIdAndDelete(_id);
      if(deleted?.imageUrl)
      {
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
