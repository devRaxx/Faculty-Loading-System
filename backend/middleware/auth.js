const jwt = require('jsonwebtoken');

const requireAuth = (req, res, next) => {
    const token = req.cookies.jwt;

    if(token){
        jwt.verify(token, process.env.SECRET_KEY, (err, decodedToken)=>{
            if(err){
                res.status(401).json(err);
            }else if(decodedToken){
                req.user = decodedToken.userType
                next();
            }else{
                res.status(401).json({error: "Permission not granted"});
            }
        })
    }else{
        res.status(401).json({error: "Authentication Failure"});
    }
}

const requireSuperUserAuth = (req, res, next) => {
    const token = req.cookies.jwt;

    if(token){
        jwt.verify(token, process.env.SECRET_KEY, (err, decodedToken)=>{
            if(err){
                res.status(401).json(err);
            }else if(decodedToken.userType = "Super User"){
                next();
            }else{
                res.status(401).json({error: "Permission not granted"});
            }
        })
    }else{
        res.status(401).json({error: "Authentication Failure"});
    }
}

const requireAdminAuth = (req, res, next) => {
    const token = req.cookies.jwt;

    if(token){
        jwt.verify(token, process.env.SECRET_KEY, (err, decodedToken)=>{
            if(err){
                res.status(401).json(err);
            }else if(decodedToken.userType = "Admin"){
                req.user = decodedToken.userType
                next();
            }else{
                res.status(401).json({error: "Permission not granted"});
            }
        })
    }else{
        res.status(401).json({error: "Authentication Failure"});
    }
}

module.exports = {
    requireAuth,
    requireSuperUserAuth,
    requireAdminAuth,
}