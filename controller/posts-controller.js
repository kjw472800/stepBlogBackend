const mongoose= require('mongoose');
const { MongoClient, ObjectID } = require('mongodb');
const Post=require('../models/post');
const User=require('../models/user');
const HttpError = require('../models/http-error');


const getPostByUserId= async(req,res,next)=>{
    
};

const getPostByPostId= async(req,res,next)=>{
    
}

const createPost = async (req, res, next) => {

    let testUserId;

    try{
        testUserId=await User.findOne({email:'test1@test.com'});
    }catch(error){
        next(error);
        return ;   
    }

    const newPost = new Post({
        title:'testTitle',
        description:'testDescription',
        steps: [],
        creator:testUserId.id
    })
    
    let user;    
    try{
        user=await User.findById(testUserId.id);
    }catch(err){
        const error= new HttpError("Creating place failed,Sorry about system errors",500);
        return next(error);
    }

    if(!user){
        const error= new HttpError("Creating place failed,Could not find this user",500);
        return next(error);
    }

    console.log(user);
    console.log(newPost);
    // save place and update user,so we have to do a transaction
    try{
        //await newPost.save();
        const sess=await mongoose.startSession();
        sess.startTransaction();
        await newPost.save({session:sess});
        user.postIds.push(newPost);
        await user.save({session:sess});
        await sess.commitTransaction();

    }catch(err){
        const error= new HttpError("Creating place failed",500);
        return next(err);
    }

    res.status(201).json({ post: newPost });
}

exports.getPostByPostId=getPostByPostId;
exports.getPostByUserId=getPostByUserId;
exports.createPost=createPost;