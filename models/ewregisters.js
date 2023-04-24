const mongoose =  require('mongoose');
const Schema = mongoose.Schema;

const eventregSchema = new Schema({
    userid:String,
    name:String,
    gpaynum: String,
    blobname:String,
    isVerified:Boolean,
});

const workshopregSchema = new Schema({
    userid:String,
    name:String,
    gpaynum: String,
    blobname:String,
    worshopid:String,
    isVerified:Boolean,
});


const EventsReg = mongoose.model("c",eventregSchema,"eventsreg");
const WorshopReg=mongoose.model("d",workshopregSchema,"workshopreg");

module.exports={EventsReg,WorshopReg}