const jwt = require('jsonwebtoken');
const User = require("../models/user");
const utils = require('../utils/utils');
module.exports = async(req, res, next) => {
    try {
        const bearertoken = req.headers.authorization;
        const token = bearertoken.split(" ")[1];
        const decoded = jwt.verify(token, process.env.JWT_KEY);
        req.userData = decoded;
        next();
    } catch (error) {
        console.log(error); 
        return res.status(401).json({
            success:false ,
            message: 'Auth failed'
        });
    }
};