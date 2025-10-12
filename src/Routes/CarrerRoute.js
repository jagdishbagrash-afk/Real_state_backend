const express = require('express');

const { JobPost, JobGet } = require("../Controller/carrer");
const { upload } = require('../Utill/S3');
const router = express.Router();

//contact  List 

router.post("/job-add", upload.single("file"), JobPost);

router.get("/job-get", JobGet);

module.exports = router;