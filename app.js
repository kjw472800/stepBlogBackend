require('dotenv').config();
const express= require('express');
const bodyParser=require('body-parser');
const mongoose = require('mongoose');
let cors = require('cors')
const fs= require('fs');
const path=require('path');
const AWS= require('aws-sdk');

const placesRoutes= require('./routes/places-route');
const usersRoutes= require('./routes/users-route');
const postsRoutes= require('./routes/posts-route');
const HttpError = require('./models/http-error')


const app = express();

app.use(bodyParser.json());

app.use('/uploads/images', express.static(path.join('uploads','images')));
app.use('/uploads/images', express.static(path.join('uploads','images')));

app.use(cors());

app.use('/api/users', usersRoutes);
app.use('/api/places',placesRoutes);
app.use('/api/posts',postsRoutes);

app.use((req, res, next) => {
    
    const error = new HttpError('Could not find this route', 404);
     next(error);
});

app.use((error, req, res, next) => {
    if(req.imgKey){
        let s3bucket = new AWS.S3({
            accessKeyId: process.env.AWS_ACCESS_KEY_ID,
            secretAccessKey: process.env.AWS_ACCESS_SECRET_KEY,
            region: process.env.AWS_REGION
        });
        let params = {
            Bucket: process.env.AWS_BUCKET,
            Key: req.imgKey
        };
        s3bucket.deleteObject(params,(err,data)=>{
            if (err) {
                console.log(err);
                const error= new HttpError('post failed delete image failed',500);
                res.status(error.code || 500);
                res.json({ message: error.message || "An unknown error occured!" });
                return;
            } 
            res.status(error.code || 500);
            res.json({ message: error.message || "An unknown error occured!" });
            return;
        })
    }
    else{
        res.status(error.code || 500);
        res.json({ message: error.message || "An unknown error occured!" });        
    }
});


mongoose
    .connect(
        process.env.DB_HOST
        ,{useNewUrlParser: true,useUnifiedTopology: true,useCreateIndex: true})
    .then(()=>{
        app.listen(process.env.PORT || 5000);
        console.log("Connected to Database");
    })
    .catch((err)=>{
        console.log((err));
    })
