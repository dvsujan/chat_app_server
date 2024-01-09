const express = require('express');
const router = express.Router();
const message_controller = require('../controllers/message_controller');
const checkAuth = require('../middleware/checkAuth');
const checkAdmin = require('../middleware/checkAdmin');


router.post("/:channel_id", message_controller.addMessage);
router.get("/:channel_id", message_controller.getMessages);
router.delete("/:messge_id",message_controller.deleteMessage)


module.exports = router ; 