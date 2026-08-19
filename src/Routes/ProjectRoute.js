const express = require("express");
const router = express.Router();

const {
  CreateprojectAdd,
  getAllProjectAll,
  GetProjectById,
  DeleteProject,
  UpdateProject,
  DeleteAWSImages,
} = require("../Controller/ProjectController");

const { upload } = require("../Utill/S3UploadData");


router.post(
  "/project-add",
  upload.fields([
    { name: "banner_image", maxCount: 1 },
    { name: "list_image", maxCount: 1 },
    { name: "images[]", maxCount: 50 }, 
  ]),
  CreateprojectAdd
);


router.post(
  "/project-update",
  upload.fields([
    { name: "banner_image", maxCount: 1 },
    { name: "list_image", maxCount: 1 },
    { name: "images[]", maxCount: 20 },
  ]),
  UpdateProject
);

router.get("/project-get", getAllProjectAll);

router.get("/project-details/:slug", GetProjectById);

router.post("/project/delete", DeleteProject);

router.get(
  "/project/images/delete/:projectId/:imageUrl",
  DeleteAWSImages
);

module.exports = router;