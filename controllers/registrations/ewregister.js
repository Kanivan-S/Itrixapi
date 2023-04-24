const logger = require('../../utils/log')(module);
const {EventsReg,WorshopReg} = require("../../models/ewregisters");
const { BlobServiceClient } = require("@azure/storage-blob");

const AZURE_STORAGE_CONNECTION_STRING = process.env.AZURE_STORAGE_CONNECTION_STRING;
if (!AZURE_STORAGE_CONNECTION_STRING) {
  logger.error('Azure Storage Connection string not found');
}
const blobServiceClient = BlobServiceClient.fromConnectionString(AZURE_STORAGE_CONNECTION_STRING);

function containerClient(containerName){
    return blobServiceClient.getContainerClient(containerName);
}



const eventsreg=async(req,res)=>{
    try{
        const ublobname=res.locals._id+Date.now()+".txt"
        // logger.info(req.file.originalname);
        const blockBlobClient = containerClient("eventregproofs").getBlockBlobClient(ublobname);
        // const data = req.file.buffer;
        const data ="req.file.buffer";

        const uploadBlobResponse = await blockBlobClient.upload(data, data.length);
       logger.info(
            `Blob was uploaded successfully. requestId: ${uploadBlobResponse.requestId}`
        );
        const fetch=await EventsReg.findOne({
            userid:res.locals._id,
        })
        if(fetch){
            return res.status(403).send({message:"Already Paid!"});
        }
        else{
           
            const neweventreg={
                userid:res.locals._id,
                name:req.body.name,
                gpaynum:req.body.gpaynum,
                blobname:ublobname,
                isVerified:Boolean(false)
            }
            await EventsReg.create(neweventreg);
            return res.status(200).send({message:"Added successfully"}); 
        }
        
    }
    catch(err){
        logger.info(err);
        logger.error(err);
        return res.status(500).send({ message: "Server Error" });
    }
}
const workshopreg=async(req,res)=>{
    try{
        const ublobname=res.locals._id+Date.now()+".txt"
        logger.info(req.file.originalname);
        const blockBlobClient = containerClient("workshopregproofs").getBlockBlobClient(ublobname);
        const data = req.file.buffer;
        const uploadBlobResponse = await blockBlobClient.upload(data, data.length);
       logger.info(
            `Blob was uploaded successfully. requestId: ${uploadBlobResponse.requestId}`
        );
        const fetch=await WorshopReg.findOne({
            userid:res.locals._id,
        })
        if(fetch){
            return res.status(403).send({message:"Already Paid!"});
        }
        else{
            const newworshopreg={
                userid:res.locals._id,
                name:req.body.name,
                gpaynum:req.body.gpaynum,
                blobname:ublobname,
                worshopid:req.body.worshopid,
                isVerified:Boolean(false)
            }
            await WorshopReg.create(newworshopreg);
            return res.status(200).send({message:"Added successfully"}); 
        }
    }
    catch(err){
        logger.info(err);
        logger.error(err);
        return res.status(500).send({ message: "Server Error" });
    }
}
module.exports={eventsreg,workshopreg}