const express = require("express");

const blogController = require("../Controller/BlogController");
const { upload } = require("../Utill/S3");

const router = express.Router();

router.post(
    "/blog/create",
    upload.single("image"),
    blogController.createBlog
);

router.get(
    "/blog/get",
    blogController.getAllBlogs
);

router.get(
    "/blog/details/:slug",
    blogController.getBlogBySlug
);

router.get(
    "/blog/get/:Id",
    blogController.getBlogById
);

router.post(
    "/blog/update",
    upload.single("image"),
    blogController.updateBlogById
);

router.post(
    "/blog/delete",
    blogController.BlogIdDelete
);

module.exports = router;