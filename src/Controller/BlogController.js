const Blog = require('../Model/Blog');
const catchAsync = require('../Utill/catchAsync');

// Create a new blog post
exports.createBlog = catchAsync(async (req, res) => {
  try {
    const { title, content, Image, short_content } = req.body;
    if (!title || !content || !short_content) {
      logger.warn("All fields (title, content, short content) are required.")
      return res.status(400).json({
        status: false,
        message: "All fields (title, content, short content) are required.",
      });
    }
    const slug = title
      .trim()
      .toLowerCase()
      .replace(/\s+/g, "-")
      .replace(/[^\u0900-\u097F\w\-]/g, "")      
      .replace(/-+/g, "-")                     
      .replace(/^-+|-+$/g, "");
    const newBlog = new Blog({
      title,
      slug: slug,
      content,
      short_content,
      Image,
    });
    const record = await newBlog.save();

    res.status(201).json({
      status: true,
      message: "Blog Success"
    });
  } catch (error) {
    res.status(400).json({
      status: false,
      message: error.message,
    });
  }
}
);

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

// Update a blog post by ID
exports.updateBlogById = catchAsync(async (req, res) => {
  try {

    const { title, content, Image, _id, short_content } = req.body;
    // Validate required fields
    if (!title || !content || !_id || !short_content) {
      logger.warn("All fields (title, content, Image , short_content) are required.")
      return res.status(400).json({
        status: false,
        message: "All fields (title, content, Image) are required.",
      });
    }
    const slug = title
      .trim()
      .toLowerCase()
      .replace(/\s+/g, "-")
      .replace(/[^\u0900-\u097F\w\-]/g, "")      // keep Hindi + a-z + 0-9 + _
      .replace(/-+/g, "-")                       // remove multiple dashes
      .replace(/^-+|-+$/g, "");                  // trim dashes from start/end


    const blog = await Blog.findByIdAndUpdate(
      _id,
      {
        title, content, Image, short_content, meta_title: req.body.meta_title,
        meta_description: req.body.meta_description, meta_keyword: req.body.meta_keyword,
        slug: slug,
      },
      {
        new: true,
        runValidators: true,
      }
    );
    if (!blog) {
      return res.status(404).json({
        status: false,
        message: 'Blog not found',
      });
    }
    res.status(200).json({
      status: true,
      data: blog,
      message: "Bolg Update"
    });
  } catch (error) {
    res.status(400).json({
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
