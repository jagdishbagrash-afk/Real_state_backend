const Project = require("../Model/Project");
const catchAsync = require('../Utill/catchAsync');
const { deleteFile } = require("../Utill/S3");

// Create a new project
exports.CreateprojectAdd = async (req, res) => {
  try {
    const {
      title,
      content,
      client,
      category,
      client_review,
      client_name,
      location,
      status,
    } = req.body;


    const imageUrls = req.files["images[]"]?.map((f) => f.location) || [];
    const banner_image = req.files["banner_image"]?.[0]?.location || "";
    const list_image = req.files["list_image"]?.[0]?.location || "";


    const record = new Project({
      title,
      content,
      client,
      category,
      client_review,
      client_name,
      location,
      date,
      slug: title.toLowerCase().replace(/\s+/g, "-"),
      banner_image,
      list_image,
      Image: imageUrls,
      status
    });

    await record.save();
    res.json({ status: true, message: "Project added successfully", data: record });
  } catch (err) {
    console.error("Error creating project:", err);
    res.status(400).json({ status: false, message: err.message });
  }
};




exports.getAllProjectAll = catchAsync(async (req, res) => {
  try {
    const page = Math.max(parseInt(req.query.page) || 1, 1); // Ensure page is at least 1
    const limit = Math.max(parseInt(req.query.limit) || 50, 1); // Ensure limit is at least 1
    const skip = (page - 1) * limit;

    const search = req.query.search ? String(req.query.search).trim() : ""; // Ensure search is a string
    let query = {};

    if (search !== "") {
      query = { title: { $regex: new RegExp(search, "i") } }; // Use RegExp constructor
    }

    const totalUsers = await Project.countDocuments(query);
    const totalPages = Math.ceil(totalUsers / limit);
    const ProjectAll = await Project.find(query).sort({ createdAt: -1 }).skip(skip).limit(limit); // Add pagination

    res.status(200).json({
      status: true,
      data: ProjectAll,
      totalUsers,
      totalPages,
      currentPage: page,
      perPage: limit,
      nextPage: page < totalPages ? page + 1 : null,
      previousPage: page > 1 ? page - 1 : null,
    });

  } catch (error) {
    res.status(400).json({
      status: false,
      message: error.message,
    });
  }
});


exports.updateProject = catchAsync(async (req, res) => {
  const { title, content, client, date, category, Image, _id } = req.body;

  const updated = await Project.findByIdAndUpdate(
    _id,
    { title, content, client, date, category, Image },
    { new: true }
  );

  if (!updated) {
    return res.status(404).json({
      status: false,
      message: "Project not found",
    });
  }

  res.json({
    status: true,
    message: "Project Updated Successfully",
    data: updated,
  });
});


exports.DeleteProject = catchAsync(async (req, res) => {
  try {
    const { _id } = req.body;
    console.log("req.body", req.body)
    const project = await Project.findById(_id);
    if (!project) {
      return res.status(404).json({ status: false, message: "Project not found" });
    }

    await deleteFile(project.banner_image); // deleteFile handles single URL

    await deleteFile(project.list_image); // deleteFile handles single URL

    // ✅ Delete all images from S3
    if (project.Image && project.Image.length > 0) {
      // Loop over each image URL
      for (const url of project.Image) {
        await deleteFile(url); // deleteFile handles single URL
      }
    }

    await project.deleteOne();

    res.json({
      status: true,
      message: "Project deleted successfully (including images)",
    });
  } catch (error) {
    console.error("Error deleting project:", error);
    res.status(400).json({
      status: false,
      message: error.message,
    });
  }
});


exports.GetProjectById = catchAsync(
  async (req, res) => {
    try {
      const { Id } = req.params;
      if (!Id) {
        logger.warn("Project ID is required")
        return res.status(400).json({ msg: "Project ID is required" });
      }
      const Projects = await Project.findById(Id);
      if (!Projects) {
        return res.status(404).json({
          status: false,
          message: 'Project not found',
        });
      }
      res.status(200).json({
        status: true,
        data: Projects,
        message: 'Project fetched successfully',
      });
    } catch (error) {
      res.status(400).json({
        status: false,
        message: error.message,
      });
    }
  }
);
