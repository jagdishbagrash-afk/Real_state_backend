const express = require("express");
const router = express.Router();
const jobController = require("../Controller/jobAddController");

router.post("/jobadd", jobController.createJob);
router.get("/jobget", jobController.getJobs);
router.get("/jobget/:id", jobController.getJob);
router.post("/jobedit", jobController.updateJob);
router.post("/jobdelete", jobController.deleteJob);

module.exports = router;
