const { body, header, param, query } = require("express-validator");
const { validate } = require("../validators");
const regValidator = async (req, res, next) => {
	console.log(req.body);
	await body("name")
		.notEmpty()
		.withMessage("username not defined in body")
		.run(req);

    await body("gpaynumber")
		.notEmpty()
		.withMessage("phone number not defined in body")
		.bail()
		.isNumeric().isLength({ min: 10, max: 11 })
        .withMessage("Invalid Phone number !")
		.run(req);

    await body("transamount")
		.notEmpty()
		.withMessage("Transaction  amount not defined in body")
		.bail()
		.isNumeric().isLength({ min: 1 })
        .withMessage("Invalid Transaction amount!")
		.run(req);
	next();
}
const workshopValidator=async (req,res,next)=>{
	await body("workshopid")
		.notEmpty()
		.withMessage("Worshop not defined in body")
		.run(req)
	next();
}

module.exports={regValidator,workshopValidator}