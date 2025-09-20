const express = require('express');

const { ContactPost, ContactGet, ContactPortPost, ContactPortGet } = require("../Controller/ContactController");
const router = express.Router();

//contact  List 

router.post("/contact-add", ContactPost);

router.get("/contact-get", ContactGet);


router.post("/port-add", ContactPortPost);

router.get("/port-get", ContactPortGet);



module.exports = router;