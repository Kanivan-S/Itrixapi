var express = require('express');
var app = express();
var logger=require("./utils/log")(module)
const env = require("dotenv")
env.config()
const mongoose=require("mongoose")
const cors = require("cors")
const  {verifyToken}=require('./utils/token');

mongoose.connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    logger.info("DB - Connection Established!");
})

app.use(cors({
  origin: '*'
}));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

const unAuthRoutes = ["/api/auth/login" ,"/api/auth/register","/api/forgot-password"]

//filter authorised routes from unauthorised 
app.use((req, res, next) => {

   logger.info(req.url)

   const flag = unAuthRoutes.includes(req.url)

   if (flag) {next();}

  else {

    // verify jwt and proceed 
 
    const data = verifyToken(req);
    
    if (data) {
    
      if (req.url === "/api/auth/JWTVerify") {
       
        return res.status(200).send({ message : "valid token" ,  data })
      
      }
      else {
        res.locals.role = data.role
        res.locals._id = data.id
        next();
      }
    }
    // token expired or invalid status code 
    else return res.status(401).send({ message:"invalid token" }) 
  }
})

const authroutes=require('./routes/auth');
app.use('/api/auth',authroutes)


app.use(function(req, res, next) {
  return res.status(404).send({msg:"Not found!"})
});



app.listen(3001, (err) => {
  if (!err) logger.info("App Started!!")
  else logger.error("Error Starting") ;
})
