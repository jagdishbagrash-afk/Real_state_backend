const TeamMember = require("../Model/TeamMember");
const { uploadFileToSpaces } = require("../Utill/S3.js");
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
    const { name, imageurl, position } = req.body;

    if (!name || !position) {
      return res.status(400).json({
        message: "All fields are required",
        status: false,
      });
    }

        if (Files.imageurl?.[0]) {
      if (updated?.imageurl) {
        const isDeleted = await deleteFileFromSpaces(updated.imageurl);
        if (!isDeleted) {
          return res.status(500).json({ status: false, message: "Unable to delete old hero_img_second" });
        }
      }
      const fileKey = await uploadFileToSpaces(Files.imageurl[0]);
      updateData.imageurl = fileKey; // ✅
    }

    const member = await TeamMember.create({
      name,
      position,
      imageurl,
    });

    res.status(201).json({
      message: "Team member added successfully",
      member,
      status: true,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
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
