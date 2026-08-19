const Project = require("../Model/Project");
const catchAsync = require('../Utill/catchAsync');
const { deleteFile } = require("../Utill/S3");
const { S3Client, DeleteObjectCommand } = require("@aws-sdk/client-s3");

const s3Client = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

// // Create a new project
// exports.CreateprojectAdd = async (req, res) => {
//   try {
//     const {
//       title,
//       content,
//       client,
//       category,
//       client_review,
//       client_name,
//       location,
//       status,
//     } = req.body;


//     const imageUrls = req.files["images[]"]?.map((f) => f.location) || [];
//     const banner_image = req.files["banner_image"]?.[0]?.location || "";
//     const list_image = req.files["list_image"]?.[0]?.location || "";


//     const record = new Project({
//       title,
//       content,
//       client,
//       category,
//       client_review,
//       client_name,
//       location,
//       slug: title.toLowerCase().replace(/\s+/g, "-"),
//       banner_image,
//       list_image,
//       Image: imageUrls,
//       status
//     });

//     await record.save();
//     res.json({ status: true, message: "Project added successfully", data: record });
//   } catch (err) {
//     console.error("Error creating project:", err);
//     res.status(400).json({ status: false, message: err.message });
//   }
// };



const {
  uploadFile,
  uploadMultipleFiles,
} = require("../Utill/s3Upload");

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
    const list_image = req.files["list_image"]?.[0]?.location || "";
    const banner_image = req.files["banner_image"]?.[0]?.location || "";


    const record = new Project({
      title,
      content,
      client,
      category,
      client_review,
      client_name,
      location,
      slug: title.toLowerCase().replace(/\s+/g, "-"),
      banner_image,
      list_image,
      Image: imageUrls,
      status,
    });

    await record.save();

    res.json({
      status: true,
      message: "Project added successfully",
      data: record,
    });
  } catch (err) {
    res.status(400).json({
      status: false,
      message: err.message,
    });
  }
};

// exports.updateProject = async (req, res) => {
//   try {
//     const { id } = req.body;
//     const {
//       title,
//       content,
//       client,
//       category,
//       client_review,
//       client_name,
//       location,
//       status,
//     } = req.body;

//     // Get files (if any new ones uploaded)
//     const imageUrls = req.files?.["images[]"]?.map((f) => f.location) || [];
//     const banner_image = req.files?.["banner_image"]?.[0]?.location;
//     const list_image = req.files?.["list_image"]?.[0]?.location;

//     console.log("Updating project with ID:", imageUrls);

//     // Find existing project
//     const project = await Project.findById({ _id: id });
//     if (!project) {
//       return res.status(404).json({ status: false, message: "Project not found" });
//     }

//     // Update text fields
//     project.title = title || project.title;
//     project.content = content || project.content;
//     project.client = client || project.client;
//     project.category = category || project.category;
//     project.client_review = client_review || project.client_review;
//     project.client_name = client_name || project.client_name;
//     project.location = location || project.location;
//     project.status = status || project.status;
//     project.slug = title
//       ? title.toLowerCase().replace(/\s+/g, "-")
//       : project.slug;

//     // Update images only if new ones uploaded
//     if (banner_image) project.banner_image = banner_image;
//     if (list_image) project.list_image = list_image;
//     if (imageUrls.length > 0) {
//       project.Image = [...project.Image, ...imageUrls]; // append new images
//     }

//     await project.save();

//     res.json({
//       status: true,
//       message: "Project updated successfully",
//       data: project,
//     });
//   } catch (err) {
//     console.error("Error updating project:", err);
//     res.status(400).json({ status: false, message: err.message });
//   }
// };


exports.UpdateProject = (async (req, res) => {
  try {
    const { title,
      content,
      client,
      category,
      client_review,
      client_name,
      location,
      status, } = req.body;

    const data = await Project.findById(req.body.id);
    console.log("data", data)

    if (!data) {
      return res.status(404).json({ status: false, message: "Project not found" });
    }

    // ✅ Update fields
    if (title) {
      data.slug = title ? title.toLowerCase().replace(/\s+/g, "-") : project.slug;
    }

    data.title = title || data.title;
    data.content = content || data.content;
    data.client = client || data.client;
    data.category = category || data.category;
    data.client_review = client_review || data.client_review;
    data.client_name = client_name || data.client_name;
    data.location = location || data.location;
    data.status = status || data.status;

    // Get files (if any new ones uploaded)
    const imageUrls = req.files?.["images[]"]?.map((f) => f.location) || [];
    const list_image = req.files?.["list_image"]?.[0]?.location;
    const banner_image = req.files?.["banner_image"]?.[0]?.location;


    if (list_image) data.list_image = list_image;
    if (banner_image) data.banner_image = banner_image;

    if (imageUrls.length > 0) {
      data.Image = [...data.Image, ...imageUrls];
    }

    const updatedprojects = await data.save();

    res.json({
      status: true,
      message: "Project updated successfully",
      data: updatedprojects,
    });
  } catch (error) {
    console.log(error);
    res.status(400).json({ status: false, message: error.message });
  }
});

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
    let ProjectAll = await Project.find(query).sort({ createdAt: -1 }).skip(skip).limit(limit); // Add pagination

    const order = { completed: 1, upcoming: 2, ongoing: 3 };
    ProjectAll.sort((a, b) => order[a.status] - order[b.status]);
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




exports.DeleteProject = catchAsync(async (req, res) => {
  try {
    const { id } = req.body;
    console.log("req", req.body);

    if (!id) {
      return res.status(400).json({ status: false, message: "Project ID is required" });
    }

    const project = await Project.findById({ _id: id });
    console.log("project", project);
    if (!project) {
      return res.status(404).json({ status: false, message: "Project not found" });
    }

    // ✅ Delete images from S3
    if (project.banner_image) await deleteFile(project.banner_image);
    if (project.list_image) await deleteFile(project.list_image);

    if (Array.isArray(project.Image) && project.Image.length > 0) {
      for (const url of project.Image) {
        await deleteFile(url);
      }
    }

    // ✅ Delete project from DB
    await Project.findByIdAndDelete({ _id: id });

    return res.json({
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



exports.GetProjectById = catchAsync(async (req, res) => {
  try {
    const { slug } = req.params;

    if (!slug || typeof slug !== "string") {
      return res.status(400).json({ status: false, message: "Invalid slug" });
    }

    // ✅ Correct query
    const project = await Project.findOne({ slug: slug.trim() });


    if (!project) {
      return res.status(404).json({
        status: false,
        message: "Project not found",
      });
    }

    res.status(200).json({
      status: true,
      data: project,
      message: "Project fetched successfully",
    });
  } catch (error) {
    console.error("Error in GetProjectById:", error);
    res.status(400).json({
      status: false,
      message: error.message,
    });
  }
});


exports.DeleteAWSImages = catchAsync(async (req, res) => {
  try {
    let { projectId, imageUrl } = req.params;

    if (!projectId) {
      return res.status(400).json({ status: false, message: "projectId required" });
    }

    if (!imageUrl) {
      return res.status(400).json({ status: false, message: "imageUrl required" });
    }

    // decode URL (IMPORTANT)
    imageUrl = decodeURIComponent(imageUrl);

    // make array
    const images = [imageUrl];

    // extract keys
    const keys = images.map(url => url.split(".com/")[1]);

    // 🔥 Delete from S3 (parallel)
    await Promise.all(
      keys.map(key =>
        s3Client.send(
          new DeleteObjectCommand({
            Bucket: process.env.S3_BUCKET_NAME,
            Key: key
          })
        )
      )
    );

    // 🔥 DB se remove
    await Project.updateOne(
      { _id: projectId },
      {
        $pull: {
          Image: { $in: images }
        }
      }
    );

    return res.status(200).json({
      status: true,
      message: "Image deleted successfully"
    });

  } catch (err) {
    console.error(err);
    return res.status(500).json({
      status: false,
      error: err.message
    });
  }
});

