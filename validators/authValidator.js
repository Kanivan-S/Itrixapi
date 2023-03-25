const { body, header, param, query } = require("express-validator");
const { validate } = require("../validators");



const loginValidator = async (req, res, next) => {
	await body("email")
		.notEmpty()
		.withMessage("Email is required!")
		.trim()
		.isEmail()
		.normalizeEmail()
		.withMessage("Invalid Email")
		.run(req);
	await body("password")
		.notEmpty()
		.withMessage("password not defined in body")
		.run(req);

	next();
}


const registerValidator = async (req, res, next) => {
	await body("email")
		.notEmpty()
		.withMessage("Email is required!")
		.trim()
		.isEmail()
		.normalizeEmail()
		.withMessage("Invalid Email")
		.run(req);
	await body("password")
		.notEmpty()
		.withMessage("password not defined in body")
		.isLength({ min: 6 })
		.withMessage("password length invalid")
		.run(req);
	await body("name")
		.notEmpty()
		.withMessage("username not defined in body")
		.run(req);
	await body("phonenum")
		.notEmpty()
		.withMessage("phone number not defined in body")
		.isNumeric().isLength({ min: 10, max: 11 })
		.run(req);
	await body("dept")
		.notEmpty()
		.withMessage("department not defined in body")
		.run(req);
	await body("college")
		.notEmpty()
		.withMessage("college not defined in body")
		.run(req);
	await body("year")
		.notEmpty()
		.withMessage("year not defined in body")
		.isNumeric().isLength({ min: 1, max: 1 })
		.run(req);

	next();
}

const SetPasswordValidator=async(req,res,next)=>{
	await body("password")
		.notEmpty()
		.isLength({ min: 6 })
		.withMessage("password length invalid")
		.bail()
		.withMessage("password not defined in body")
		.run(req);
	await body("confirmpassword")
		.notEmpty()
		.isLength({ min: 6 })
		.withMessage("password length invalid")
		.bail()
		.withMessage("confirm-password not defined in body")
		.bail()
		.run(req);
	next();
}
const ForgotPasswordValidator=async(req,res,next)=>{
	await body("email")
		.notEmpty()
		.withMessage("Email is required!")
		.trim()
		.isEmail()
		.normalizeEmail()
		.withMessage("Invalid Email")
		.run(req);
	next()
}

module.exports = {
	loginValidator,
	registerValidator,
	SetPasswordValidator,
	ForgotPasswordValidator
}

