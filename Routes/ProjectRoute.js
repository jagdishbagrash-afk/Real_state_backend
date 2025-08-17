const express = require('express');
const { CreateprojectAdd, getAllProjectAll, GetProjectById, deleteProject, updateProject } = require('../Controller/ProjectController');

const router = express.Router();

//contact  List 

router.post("/project-add", CreateprojectAdd);

router.get("/project-get", getAllProjectAll);

router.get("/project-get/:Id", GetProjectById);

router.post("/project/update", updateProject);

router.post("/project/delete", deleteProject);


module.exports = router;