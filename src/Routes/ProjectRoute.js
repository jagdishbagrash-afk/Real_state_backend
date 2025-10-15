const express = require('express');
const { CreateprojectAdd, getAllProjectAll, GetProjectById, DeleteProject, updateProject } = require('../Controller/ProjectController');
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
router.get("/project-get", getAllProjectAll);

router.get("/project-get/:Id", GetProjectById);

router.post("/project/update", updateProject);

router.post("/project/delete", DeleteProject);


module.exports = router;