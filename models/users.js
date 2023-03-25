const mongoose =  require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    email:String,
    password: String,
    expireTime:String,
    linkCode:String,
    isCreated:Boolean,
});

const userDetailSchema=new Schema({
    userid:String,
    name:String,
    phonenum:String,
    dept:String,
    college:String,
    year:String
})

const Users = mongoose.model("a",userSchema,"users");
const UserDetails=mongoose.model("b",userDetailSchema,"userdetails");

module.exports={Users,UserDetails}