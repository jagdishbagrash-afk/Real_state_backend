const express = require('express');

const { JobPost, JobGet } = require("../Controller/JobOpeningController");
const router = express.Router();

//contact  List 

router.post("/job-add", JobPost);

router.get("/job-get", JobGet);



module.exports = router;