var express = require('express');
var app = express();
var logger=require("./utils/log")(module)
const mongoose=require("mongoose")
const  {verifyToken}=require('./utils/token');

mongoose.connect("mongodb://127.0.0.1:27017/itrix-2023", {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    logger.info("Connection Established!");
})


app.use(express.json());
app.use(express.urlencoded({ extended: false }));


const authroutes=require('./routes/auth');
const ewregroutes=require('./routes/ewregister');

app.use('/api/auth',authroutes)
const unAuthRoutes=[""]

//filter authorised routes from unauthorised 
app.use((req, res, next) => {

  logger.info(req.url);
  const flag = unAuthRoutes.includes(req.url);  
  if (flag) {next();}
  
  else {

    // verify jwt and proceed 

    const data = verifyToken(req);
    
    if (data) {

      if (req.url === "/api/auth/JWTVerify") {
       
        return res.status(200).send({ status:"success", data })
      }
      else {
        res.locals.role = data.role
        res.locals._id = data.id
        next();
      }
    }
    // token expired or invalid status code 
    else return res.status(498).send({ status:"failure" }) 
  }
})

app.use("/api/ewreg",ewregroutes);

app.use(function(req, res, next) {
  return res.status(404).send({msg:"Not found!"})
});



app.listen(3001, (err) => {
  if (!err) logger.info("App Started!!")
  else logger.error("Error Starting") ;
})
