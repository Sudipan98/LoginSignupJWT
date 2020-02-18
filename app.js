const express=require('express');
const app=express();
const morgan = require('morgan');


const userRoutes=require('./api/routes/user');
const bodyParser=require('body-parser');
const mongoose=require('mongoose');
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());
app.use(morgan('dev'));
mongoose.connect('mongodb+srv://sudipan98:Sudipan@das1998@cluster0-petba.mongodb.net/test?retryWrites=true&w=majority', { useNewUrlParser: true,useMongoClient:true});
var db = mongoose.connection; 

// Added check for DB connection
if(!db)
    console.log("Error connecting db")
else
    console.log("Db connected successfully")
app.use((req,res,next)=>{
    res.header("Access-Control-Allow-Origin","*");
    res.header('Access-Control-Allow-Headers','*');

if(req.method==='OPTIONS'){
    res.header('Access-Control-Allow-Methods','PUT,POST,PATCH,DELETE,GET');
    return res.status(200).json({});
};
next();
});

app.use('/user',userRoutes);


app.use((req,res,next)=>{
    const error=new Error('Not found');
    error.status=404;
    next(error);
})
app.use((error,req,res,next)=>{
    res.status(error.status||500);
    res.json({
        error:{
            message:error.message
        }
    });
});
module.exports=app;