const jwt = require('jsonwebtoken');

module.exports = (req,res,next)=>{
    try{
        const token = req.headers.authorization.split(" ")[1];
        console.log(token);
        const decoded = jwt.verify(token, "adi");
        
        req.userData = decoded;
        console.log( req.userData);
        next();
    }catch{
        return res.status(401).json({
            message:'Auth failed'
        });
    }
    

}