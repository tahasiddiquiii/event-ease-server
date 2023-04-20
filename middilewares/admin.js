const jwt = require('jsonwebtoken');
const User = require('../models/user');

const admin = async (req, res, next) => {
    try {
        const token = req.header("x-auth-token");
        if(!token) 
            return res.status(401).json({ msg: "No Auth Token, Access Denied!" });

        const isVerified = jwt.verify(token, "passwordKey");
        if(!isVerified) 
            return res.status(401).json({ msg: "Token verification failed, Authorization Denied!" });

        const user = await User.findById(isVerified.id); 


        if (user.type == "user" || user.type == "seller"){
            return res.status(401).json({ msg: "You are not an Admin!" });
        }
        req.User = isVerified.id;
        req.token = token;
        next();
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

module.exports = admin;