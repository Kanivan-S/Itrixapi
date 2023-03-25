var express = require('express');
var app = express();
var logger=require("./utils/log")(module)
const mongoose=require("mongoose")

mongoose.connect("mongodb://127.0.0.1:27017/itrix-2023", {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    logger.info("Connection Established!");
})


app.use(express.json());
app.use(express.urlencoded({ extended: false }));


const authroutes=require('./routes/auth');

app.use('/api/auth',authroutes)



module.exports = app;
