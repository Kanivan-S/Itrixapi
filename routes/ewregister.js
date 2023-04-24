var express = require('express');
var router = express.Router();

const multer=require('multer');
var logger=require("../utils/log")(module)
var path = require('path');


const { validate } = require("../validators/index");
const {regValidator,workshopValidator}=require("../validators/regValidator");
const {eventsreg,workshopreg}=require("../controllers/registrations/ewregister");

const upload=multer({storage:multer.memoryStorage({})});

const fileValidator=async(req,res,next)=>{
    try{
        
        if(req.file && (req.file.size>0 && req.file.size<1000000)){
            console.log(req.file)
            var extension = (path.extname(filename)).toLowerCase();
            switch (extension) {
                case '.jpg':
                    next()
                case '.jpeg':
                    next()
                case  '.png':
                    next()
                default:
                    return res.status(400).send({message:"Invalid File"});
            }
        }
        else{
            return res.status(400).send({message:"Invalid File"});   
        }   
    }
    catch(err){
        logger.error(err);
        return res.status(500).send({message:"Server error"});
    }
}

router.post('/eventsreg',
(req,res,next)=>{
    console.log(req.body);next()
},
    regValidator,
    validate,
    // upload.single('screenshotfile'),
    // fileValidator,
    eventsreg
)
router.post('/workshopreg',
    regValidator,
    workshopValidator,
    validate,
    // upload.single('screenshotfile'),
    // fileValidator,
    workshopreg
)

router.use(function(req, res, next) {
	return res.status(404).send({msg:"Not found!"})
  });
	
module.exports = router;
