const jwt = require('jsonwebtoken')
const {Users,UserDetails} = require("../../models/users");
const crypto = require("crypto");
const bcrypt=require("bcrypt");
const {transporter,jwtDetails}=require("../../config/config");
const logger = require('../../utils/log')(module);



const login = async (req, res) => {
	try {
        const data=await Users.findOne(
            {
                email:req.body.email
            }
        )
        if(data && Boolean(data.isCreated)){
            logger.info(data.password);
            
            const match = await bcrypt.compare(req.body.password, data.password);
            
            if(match){
                    let token = jwt.sign({ role:"USER",id:data._id}, jwtDetails.secret, {
                        expiresIn: jwtDetails.jwtExpiration,
                    });
                    return res.status(200).json({accessToken:token,message:"Success"});
            }
            else{
                return res.status(401).send({message:"Failure"})
            }
        }
        else{
            return res.status(401).send({message:"Failure."})
        }
	} catch (error) {
        logger.info(error);
		return res.status(500).send({ message: "Server Error. Try again." });
	}
}

module.exports = {
    login
}