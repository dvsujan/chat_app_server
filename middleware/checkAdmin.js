const jwt = require('jsonwebtoken');
const User = require("../models/user");
const Channel = require("../models/channel")
module.exports = async(req, res, next) => {
    try {
        const token = req.headers.authorization.split(" ")[1];
        const decoded = jwt.verify(token, process.env.JWT_KEY);
        const channelId = req.params.channel_id;
        const channel = await Channel.findById(channelId);
        if(!channel){ 
            throw new Error("Channel not found");
        }
        if(channel.admins.indexOf(decoded._id) === -1){ 
            throw new Error("You are not an admin of this channel");
        }
        req.userData = decoded;
        next();
    } catch (error) {
        console.log(error); 
        return res.status(401).json({
            success:false ,
            message: 'Auth failed'
        });
    }
}