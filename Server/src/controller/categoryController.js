import CategoryModel from "../models/categoryModel.js";
import cloudinary from "../config/cloudinary.js";

//ADD Category
const addCategory=async(req,res)=>{

    try{
        const{name,description}=req.body;
        const existingCategory=await CategoryModel.findOne({name});
        if(existingCategory){
            return res.status(409).json({message:"Category already exists"});
        }

    let image = "";

    if (req.file) {
      const result = await new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          {
            folder: "categories",
          },

          (error, result) => {
            if (error) reject(error);

            else resolve(result);
          }
        );

        stream.end(req.file.buffer);
      });

      image = result.secure_url;
    }
        const category=new CategoryModel({name,description,image});
            await category.save();
        res.json({message:"Category added successfully",category});
    }
    catch(error){
        console.log(error.message);
        res.json({message:"Category addition failed",error:error.message});
    }
}

//Get All Categories

const getAllCategories=async(req,res)=>{
    try{
        const categories=await CategoryModel.find();
        res.json({message:"Categories fetched successfully",categories});
    }
    catch(error){
        console.log(error.message);
        res.json({message:"Failed to fetch categories",error:error.message});
    }
};

//Get Single Category
const getSingleCategory=async(req,res)=>{
    try{
        const category=await CategoryModel.findById(req.params.id);

        if(!category)
        {
            return res.status(404).json({message:"Category not found"});
        }  
         res.status(200).json({
      message: "Category fetched successfully",
      category,
    }); 
    }
    catch(error){
        console.log(error.message);
        res.json({message:"Failed to fetch category",error:error.message});
    }
};

//Update Category

const updateCategory=async(req,res)=>{
    try{
        const{name,description}=req.body;
        const category=await CategoryModel.findById(req.params.id);
        if(!category){
            return res.status(404).json({message:"Category not found"});
        }
        if(name){
            category.name=name;
        }
        if(description){
            category.description=description;
        }

         if (req.file) {
      const result = await new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          {
            folder: "categories",
          },
          (error, result) => {
            if (error) reject(error);
            else resolve(result);
          }
        );

        stream.end(req.file.buffer);
      });

      category.image = result.secure_url;
    }

        await category.save();
        res.json({message:"Category updated successfully",category});
    }
    catch(error){
        console.log(error.message);
        res.json({message:"Category update failed",error:error.message});   
    }

};

//Delete Category
const deleteCategory=async(req,res)=>{
    try{
        const category=await CategoryModel.findById(req.params.id);
        if(!category){
            return res.status(404).json({message:"Category not found"});
        }
        await CategoryModel.findByIdAndDelete(req.params.id);
        res.json({message:"Category deleted successfully"});
    }
    catch(error){
        console.log(error.message);
        res.json({message:"Category deletion failed",error:error.message});
    }
};  

export {addCategory,getAllCategories,getSingleCategory,updateCategory,deleteCategory};




        

    


