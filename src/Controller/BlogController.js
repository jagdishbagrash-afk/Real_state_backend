const Blog = require('../Model/Blog');
const catchAsync = require('../Utill/catchAsync');


exports.createBlog = catchAsync(async (req, res) => {
  try {
    console.log("========== CREATE BLOG ==========");
    console.log("BODY:", req.body);
    console.log("FILE:", req.file);

    const {
      title,
      content,
      short_content,
      meta_title,
      meta_description,
      meta_keyword,
    } = req.body || {};

    if (!title || !content || !short_content) {
      return res.status(400).json({
        status: false,
        message: "Title, content and short content are required.",
      });
    }

    const image = req.file?.location || "";

    const slug = title
      .trim()
      .toLowerCase()
      .replace(/\s+/g, "-")
      .replace(/[^\u0900-\u097F\w\-]/g, "")
      .replace(/-+/g, "-")
      .replace(/^-+|-+$/g, "");

    console.log("META TITLE:", meta_title);
    console.log("META DESCRIPTION:", meta_description);
    console.log("META KEYWORD:", meta_keyword);
    console.log("IMAGE:", image);

    const newBlog = new Blog({
      title,
      slug,
      content,
      short_content,
      image,
      meta_title: meta_title || "",
      meta_description: meta_description || "",
      meta_keyword: meta_keyword || "",
    });

    const record = await newBlog.save();

    console.log("SAVED BLOG:", record);

    return res.status(201).json({
      status: true,
      message: "Blog created successfully",
      data: record,
    });
  } catch (error) {
    console.error("CREATE BLOG ERROR:", error);

    return res.status(400).json({
      status: false,
      message: error.message,
    });
  }
});

// Get all blog posts
exports.getAllBlogs = catchAsync(async (req, res) => {
  try {
    const page = Math.max(parseInt(req.query.page) || 1, 1); // Ensure page is at least 1
    const limit = Math.max(parseInt(req.query.limit) || 50, 1); // Ensure limit is at least 1
    const skip = (page - 1) * limit;

    const search = req.query.search ? String(req.query.search).trim() : ""; // Ensure search is a string
    let query = {};

    if (search !== "") {
      query = { title: { $regex: new RegExp(search, "i") } }; // Use RegExp constructor
    }

    const totalUsers = await Blog.countDocuments(query);
    const totalPages = Math.ceil(totalUsers / limit);
    const blogs = await Blog.find(query).sort({ createdAt: -1 }).skip(skip).limit(limit); // Add pagination

    res.status(200).json({
      status: true,
      data: blogs,
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

// Get a single blog post by ID
exports.getBlogById = catchAsync(
  async (req, res) => {
    try {
      const { Id } = req.params;
      if (!Id) {
        logger.warn("Blog ID is required")
        return res.status(400).json({ msg: "Blog ID is required" });
      }
      const blog = await Blog.findById(Id);
      if (!blog) {
        return res.status(404).json({
          status: false,
          message: 'Blog not found',
        });
      }
      res.status(200).json({
        status: true,
        data: blog,
        message: 'Blog fetched successfully',
      });
    } catch (error) {
      res.status(400).json({
        status: false,
        message: error.message,
      });
    }
  }
);

// Update Blog
exports.updateBlogById = catchAsync(async (req, res) => {
  try {
    const {
      title,
      content,
      short_content,
      _id,
      meta_title,
      meta_description,
      meta_keyword,
    } = req.body;

    if (!title || !content || !_id || !short_content) {
      return res.status(400).json({
        status: false,
        message: "Title, content, short content and _id are required.",
      });
    }

    const blog = await Blog.findById(_id);

    if (!blog) {
      return res.status(404).json({
        status: false,
        message: "Blog not found",
      });
    }

    const slug = title
      .trim()
      .toLowerCase()
      .replace(/\s+/g, "-")
      .replace(/[^\u0900-\u097F\w\-]/g, "")
      .replace(/-+/g, "-")
      .replace(/^-+|-+$/g, "");

    // Keep old image if new image is not uploaded
    let image = blog.image;

    if (req.file) {
      image = req.file.location;
    }

    blog.title = title;
    blog.content = content;
    blog.short_content = short_content;
    blog.image = image;
    blog.slug = slug;

    blog.meta_title = meta_title || "";
    blog.meta_description = meta_description || "";
    blog.meta_keyword = meta_keyword || "";

    const updatedBlog = await blog.save();

    return res.status(200).json({
      status: true,
      data: updatedBlog,
      message: "Blog updated successfully",
    });
  } catch (error) {
    return res.status(400).json({
      status: false,
      message: error.message,
    });
  }
});
exports.getBlogBySlug = catchAsync(async (req, res) => {
  try {
    const { slug } = req.params;

    if (!slug) {
      return res.status(400).json({
        status: false,
        message: "Blog slug is required",
      });
    }

    const blog = await Blog.findOne({
      slug: slug.toLowerCase().trim(),
    });

    if (!blog) {
      return res.status(404).json({
        status: false,
        message: "Blog not found",
      });
    }

    return res.status(200).json({
      status: true,
      message: "Blog fetched successfully",
      data: blog,
    });

  } catch (error) {
    return res.status(500).json({
      status: false,
      message: error.message,
    });
  }
});
// Delete a blog post by ID
exports.BlogIdDelete = catchAsync(async (req, res, next) => {
  try {
    const { Id } = req.body;
    if (!Id) {
      logger.warn("Blog ID is required")
      return res.status(400).json({
        status: false,
        message: 'Blog ID is required.',
      });
    }
    await Blog.findByIdAndDelete(Id);

    res.status(200).json({
      status: true,
      message: 'Blog deleted successfully.',
    });
  } catch (error) {
    logger.error(error)
    res.status(500).json({
      status: false,
      message: 'Internal Server Error. Please try again later.',
    });
  }
});


