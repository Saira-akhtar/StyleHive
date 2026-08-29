import mongoose from "mongoose";

const categorySchema=new mongoose.Schema({
    name:{
        type:String,
        required:true,
        unique:true,
        trim:true,
        enum:["Men","Women","Kids"]
    },
    description:{
        type:String,
        required:true,
    },

    image:{
        type:String,
        required:true,
    },

});

const CategoryModel=mongoose.model("Category",categorySchema,"categories");

export default CategoryModel;