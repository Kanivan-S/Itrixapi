const jwt = require("jsonwebtoken");
const {jwtDetails}=require("../config/config")
var logger=require("./log")(module)
// get token present in rquest 
const getToken = (request) => {
  
  const token = request.headers['Authorization']

  if(!token) return null ;

  const arr = token.split(" ")

  if(arr.length!=2 || arr[0]!=='Bearer') return null ;

  return arr[1]

};



const verifyToken = (request) => {
  
  const token = getToken(request);

  logger.info(token)

  if (!token) return null;
 
  try {
    
    const decoded = jwt.verify(token, jwtDetails.secret);
    
    return decoded
  }
  catch (err) {
    logger.info(err)
    return null 
  }
  
}


module.exports = {
  verifyToken
}