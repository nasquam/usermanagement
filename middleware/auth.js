const config = require("config");
const jwt = require("jsonwebtoken");
function auth(req, res, next){
    const token = req.header('X-Auth-Token');
    // console.log(`Token is: ${token}`)
    if(!token) {
        return res.status(401).send('Access denied, no token provided')
    }
    if(token) {
         try {
            const decoded = jwt.verify(token, config.get('jwtPrivateKey'))
            req.user = decoded;
            next(); // The next method passes the object back, next piece of middleware in the pipeline. 
        } catch (error) {
            res.status(401).send('You are not authorized to preform this function')     
        }
    }
}
module.exports = auth;
