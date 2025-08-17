const express = require('express');
const blogController = require('../Controller/BlogController');

const router = express.Router();

router.post("/blog/create", blogController.createBlog);

router.get("/blog/get", blogController.getAllBlogs);

router.get("/blog/get/:Id", blogController.getBlogById);

router.post("/blog/update", blogController.updateBlogById);

router.post("/blog/delete", blogController.BlogIdDelete);

module.exports = router;
