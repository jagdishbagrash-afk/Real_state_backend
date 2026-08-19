const express = require("express");
const teamController = require("../Controller/teamController");
const router = express.Router();
const { upload } = require("../Utill/S3");
router.post("/teams",upload.single('file'), teamController.addMember);
router.get("/teams", teamController.getMembers);
router.post("/teams/edit",upload.single('file'), teamController.updateMember);
router.post("/team/delete", teamController.deleteMember);
router.post("/images/delete" , teamController.DeleteAWSImages)
module.exports = router;
