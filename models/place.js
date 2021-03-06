const mongoose= require('mongoose');

const Schema= mongoose.Schema;

const placeSchenma= new Schema({
    title:{type:String, required:true},
    subtitle:{type:String, required:true},
    description:{type:String, required:true},
    imageUrl:{type:String, required:true},
    imageKey:{type:String, required:true},
    address:{type:String, required:true},
    location:{
        lat:{type:Number,required:true},
        lng:{type:Number,required:true}
    },
    creator:{type:mongoose.Types.ObjectId, required:true, ref:'User'}
}, {
    timestamps: {  }
  }
)

module.exports= mongoose.model("Place",placeSchenma);