const express = require("express");
const router = express.Router(); 
const channel_controller = require("../controllers/channel_controller");
const checkAuth = require("../middleware/checkAuth");   
const checkAdmin = require("../middleware/checkAdmin");

router.post("/create", checkAuth , channel_controller.create);
router.post("/addAdmin/:channel_id",checkAdmin ,channel_controller.addAdmin);
router.post("/addUser/:channel_id",checkAdmin, channel_controller.addUser);
router.post("/removeUser/:channel_id",checkAdmin, channel_controller.removeUser);
router.post("/removeAdmin/:channel_id",checkAdmin, channel_controller.removeAdmin);
router.post("/delete/:channel_id",checkAdmin, channel_controller.deleteChannel);
router.post("/leave/:channel_id", channel_controller.leaveChannel);
router.post("/getChannelInfo", channel_controller.getChannel);
router.post("/getChannels",checkAuth ,channel_controller.getChannels);

module.exports = router; 