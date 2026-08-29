import mongoose from "mongoose";

const reviewSchema=new mongoose.Schema({
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true
    },
    product:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Product",
        required:true
    },
    order:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"order",
        required:true

    },
    rating:{
        type:Number,
        required:true,
        min:1,
        max:5
    },
    comment:{
        type:String,
        trim:true,
    },
    title:{
        type:String,
        trim:true,
    },
    createdAt:{
        type:Date,
        default:Date.now
    }

});

reviewSchema.index(
    {product:1,user:1},
    {unique:true}

);

const ReviewModel=mongoose.model("Review",reviewSchema);

export default ReviewModel;