const express = require('express');
const { CreateprojectAdd, getAllProjectAll, GetProjectById, DeleteProject, updateProject  ,DeleteAWSImages } = require('../Controller/ProjectController');
const { upload } = require("../Utill/S3");

const router = express.Router();

//contact  List 

router.post(
  "/project-add",
  upload.fields([
    { name: "banner_image", maxCount: 1 },
    { name: "list_image", maxCount: 1 },
    { name: "images[]", maxCount: 10 },
  ]),
  CreateprojectAdd
);

router.post(
  "/project-update",
  upload.fields([
    { name: "banner_image", maxCount: 1 },
    { name: "list_image", maxCount: 1 },
    { name: "images[]", maxCount: 10 },
  ]),
  updateProject
);


router.get("/project-get", getAllProjectAll);

router.get("/project-details/:slug", GetProjectById);


router.post("/project/delete", DeleteProject);

router.get("/project/images/delete/:projectId/:images" ,DeleteAWSImages)


module.exports = router;