const Project = require("../Model/Project");
const catchAsync = require('../utill/catchAsync');



// Create a new project

exports.CreateprojectAdd = catchAsync(async (req, res) => {
  try {
    const { title, content, client, date, category, Image } = req.body;

    const record = new Project({
      title, Image, content, client, date, category
    })
    await record.save();

    res.json({
      status: true,
      message: "Project Added Successfully"
    })
  } catch (error) {
    console.log(error);
    res.status(400).json({
      status: false,
      message: error.message
    })
  }
})

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


exports.deleteProject = catchAsync(async (req, res) => {
  const { _id } = req.body;

  const deleted = await Project.findByIdAndDelete(_id);

  if (!deleted) {
    return res.status(404).json({
      status: false,
      message: "Project not found",
    });
  }

  res.json({
    status: true,
    message: "Project Deleted Successfully",
  });
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
