require("dotenv").config({path:".env"});
const express = require('express');
const app = express();


//db connection

require("./models/database").connectDatabase();

// work routes dikhana

//logger konsa route hit hua he batayega

const logger = require('morgan');
app.use(logger("tiny"));

//bodyparder//
app.use(express.json());
app.use(express.urlencoded({extended: false}));
// CORS
app.use(require("cors")({ credentials: true, origin: true }));

// for jwt it is jsonwebtoken install express-session cookie-parser jsonwebtoken

//session and cookie
const session = require('express-session');
const cookieparser = require('cookie-parser');

app.use(session({
     resave:true,
     saveUninitialized:true,
     secret: process.env.EXPRESS_SESSION_SECRET
}))

app.use(cookieparser());

//express-fileupload
const fileupload = require("express-fileupload");
app.use(fileupload())



// routes
app.use("/", require("./routes/indexRoute"));



//error handling
const ErorrHandler = require("./utils/ErrorHandling");
const {generatedErrors} = require('./middlwares/error')
app.all("*",(req,res,next)=>{
     next(new ErorrHandler(`Requested URL Not Found ${req.url}`,404))
})

app.use(generatedErrors)

app.listen(
    process.env.PORT,
    console.log(`server Runnign on Port ${process.env.PORT}`)
)