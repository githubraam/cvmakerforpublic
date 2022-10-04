const jwt = require('jsonwebtoken');

const checkLiveOrDead = (req,res, next) =>{
    const token = req.cookies.authToken;
    //console.log('token liveordead '+token)
    if(token){
        const jwtVerification = jwt.verify(token,'cvmakermernprojectgoingtobelivesoon')
        req.userStatus = jwtVerification;
        
    }else{
        req.userStatus = 'dead';
    }
    next();
}

module.exports = checkLiveOrDead;