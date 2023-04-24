const jwt = require('jsonwebtoken')
const {Users,UserDetails} = require("../../models/users");
const crypto = require("crypto");
const bcrypt=require("bcrypt");
const {transporter,jwtDetails}=require("../../config/config");
const logger = require('../../utils/log')(module);
const {sendMailLink}=require("./pwd");
const saltRounds=10;
const register=async(req,res)=>{

    try{
		var linkCode=crypto.randomBytes(4).toString("hex");
       const udata={
			email:req.body.email,
			password:req.body.password,
			linkCode:linkCode,
			expireTime:(Date.now()+24*60*60),
			isCreated:Boolean(false),
		}
		const details={
			userid:"",
			name:req.body.name,
			phonenum:req.body.phonenum,
			dept:req.body.dept,
			college:req.body.college,
			year:req.body.year
		}

		const fetch=await Users.findOne({
				email:udata.email
		})
		if(fetch){
			return res.status(403).send({message:"Maild id already exists!"});
		}
		else{

			bcrypt.genSalt(saltRounds,async (err, salt) => {
				bcrypt.hash(udata.password, salt,async (err, hashpwd) => {
					if(err){
						return res.status(500).send({ message: "Server Error." });
					}
					else{
						
						udata.password=hashpwd;
						const newuser=await Users.create(udata);
						details.userid=newuser._id;
						const newuserDet=await UserDetails.create(details);
						
						// const link=process.env.DOMAIN_NAME+"/account-set/"+newuser._id+"/"+linkCode;
						// var mailOptions={
						// 	to: newuser.email,
						// 	subject: "Set up account link: ",
						// 	html: "<h3>Account Link: </h3>"+"<p><a>" + link +"</a></p>" // html body
						// };
						// sendMailLink(mailOptions,res)
						return res.status(200).send({message:"Account registered!"});
					}
				});
				if(err){
					logger.info(err);
					return res.status(500).send({ message: "Server Error." });
				}
			});
		}
		}
    catch(err){
		logger.info(err.message);
        return res.status(500).send({ message: "Server Error." });
    }
}


const SetAccount=async (req,res)=>{
    try{
        const uid=req.params.userId;
        const linkCode=req.params.linkCode;
        const obj=await Users.findOne({
            _id:uid,
            linkCode:linkCode,
        })
    if(!obj){
        return res.status(400).send({message:"Invaid link."});
    }
    else{
		if(Boolean(obj.isCreated)){
			return res.status(301).send({message:"Account already set!"});
		}
        else if(Date.now()-obj.expireTime>0 && Boolean(obj.isCreated)){

			var token=crypto.randomBytes(4).toString("hex");
			const link=process.env.DOMAIN_NAME+"/account-set/"+obj._id+"/"+token;
			var mailOptions={
				to:obj.email,
				subject: "Set up account link: ",
				html: "<h3>Account Link: </h3>"+"<p><a>" + link +"</a></p>" // html body
			};
			sendMailLink(mailOptions,res);
        }

        else{
			const newuser=await Users.findOneAndUpdate({_id:obj._id},{isCreated:Boolean(true),expireTime:Date.now()},{new:true});
			let token = jwt.sign({ role:"USER",id:newuser._id}, jwtDetails.secret, {
				expiresIn: jwtDetails.jwtExpiration,
			});
			return res.status(200).json({accessToken:token,message:"Success"});
        }
    }
    }
    catch(err){
        logger.info(err);
        return res.status(500).send({ message: "Server Error." });
    }
}
module.exports = {
	register,
	SetAccount
};