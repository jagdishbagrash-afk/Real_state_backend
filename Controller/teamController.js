const TeamMember = require("../Model/TeamMember");

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
