const jwt = require('jsonwebtoken')
const {Users,UserDetails} = require("../../models/users");
const crypto = require("crypto");
const bcrypt=require("bcrypt");
const {transporter,jwtDetails}=require("../../config/config");
const logger = require('../../utils/log')(module);
const saltRounds=10;

const ForgotPassword=async(req,res)=>{
    try{
        const email=req.body.email
        const checkUser=await isUser(email);
        
        if(checkUser){
            var linkCode=crypto.randomBytes(4).toString("hex");
            //save to db
            const obj=await Users.findOneAndUpdate({email:email},{linkCode:linkCode,expireTime:(Date.now()+24*60*60)})  
            const link=process.env.DOMAIN_NAME+"/password-set/"+obj._id+"/"+linkCode;
            var mailOptions={
                to: email,
                subject: "Password Reset Link: ",
                html: "<h3>Reset Link: </h3>"+"<p><a>" + link +"</a></p>" // html body
            };
            sendMailLink(mailOptions,res);
        }
        else{
            return res.status(401).send({ message: "Unauthorized." });
        }
    }
    catch(err){
       logger.info(err);
        return res.status(500).send({ message: "Server Error" });
    }
}

const sendMailLink=async (mailOptions,res)=>{
    try{
        transporter.sendMail(mailOptions,async (error, info) => {
            if (error) {
                    logger.info(error);
                    return res.status(404).send({message:"Error in sending mail"});
            }
            return res.status(200).send({message:"Mail sent successfully"}); 
        })
    }
    catch(err){
        logger.info(err);
        return res.status(500).send({message:"Server Error!"});
    }   
}
const SetPassword=async (req,res)=>{
    try{
        const uid=req.params.userId;
        const linkCode=req.params.linkCode;
        const obj=await Users.findOne({
            _id:uid,
            linkCode:linkCode,
        })
    if(!obj){
        return res.status(400).send({message:"Invaid link or Expired."});
    }
    else{
        if(Date.now()-obj.expireTime>0){
            return res.status(400).send({message:"Invaid link or Expired."});
        }
        else{
            const newpswd=req.body.password;
            bcrypt.genSalt(saltRounds,async (err, salt) => {
				bcrypt.hash(newpswd, salt,async (err, hashpwd) => {
					if(err){
						return res.status(500).send({ message: "Server Error." });
					}
					else{
						const newuser=await Users.findOneAndUpdate({_id:obj._id},{password:hashpwd,expireTime:Date.now()},{new:true});
						return res.status(200).send({message:"Password set successfully"});
					}
				});
				if(err){
					return res.status(500).send({ message: "Server Error." });
				}
			});

        }
    }
    }
    catch(err){
        logger.info(err);
        return res.status(500).send({ message: "Server Error." });
    }
}
const isUser=async (email)=>{
    const data=await Users.findOne({
        email:email
    })
    return (data!=null)?true:false
}
module.exports={ForgotPassword,SetPassword,sendMailLink}