const express = require("express");
const router = express.Router();
const teamController = require("../Controller/teamController");

router.post("/teams", teamController.addMember);
router.get("/teams", teamController.getMembers);
router.post("/teams-edit", teamController.updateMember);
router.post("/teams-delete", teamController.deleteMember);

module.exports = router;
