var express = require('express');
var router = express.Router();

const { validate } = require("../validators/index");
const {loginValidator,registerValidator,SetPasswordValidator,ForgotPasswordValidator}=require("../validators/authValidator");
const {login}=require("../controllers/auth/login");
const {register,SetAccount}=require("../controllers/auth/register");
const {authenticateToken}=require("../middlewares/jwtauthverify");
const {ForgotPassword,SetPassword}=require("../controllers/auth/pwd");
router.post(
	'/login',
	loginValidator,
	validate,
	login
);

router.post(
	'/register',
	registerValidator,
	validate,
	register,
)

router.head('/verifyJWT',authenticateToken,async (req,res)=>{return res.sendStatus(200)});
router.post('/forgot-password',
	ForgotPasswordValidator,
	validate,
	ForgotPassword);


router.get('/password-set/:userId/:linkCode',
	SetPasswordValidator,
	validate,
	async(req,res,next)=>{
		if(req.body.password===req.body.confirmpassword){
			next();
		}
		else{
			return res.status(401).send({message:"password not equals confirm-password"});
		}

	},
	SetPassword)


router.get('/account-set/:userId/:linkCode',
SetAccount)
router.use(function(req, res, next) {
	return res.status(404).send({msg:"Not found!"})
  });
	
module.exports = router;
