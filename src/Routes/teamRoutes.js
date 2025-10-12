const express = require("express");
const teamController = require("../Controller/teamController");
const router = express.Router();
const { upload } = require("../Utill/S3");
router.post("/teams",upload.single('file'), teamController.addMember);
router.get("/teams", teamController.getMembers);
router.post("/teams-edit", teamController.updateMember);
router.post("/teams-delete", teamController.deleteMember);

module.exports = router;
