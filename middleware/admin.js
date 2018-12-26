// const config = require("config");
// const jwt = require("jsonwebtoken");

function admin(req, res, next){
    // 401 Unauthorized
    // 403 Forbidden

    const token = req.header('X-Auth-Token');
    if(!req.user.isAdmin) res.status(403).send("You're not an admin")
    if(req.user.isAdmin){
        console.log("You're an admin")
        next();
    }   


}

module.exports = admin;