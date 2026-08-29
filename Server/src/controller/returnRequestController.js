import ReturnRequestModel from "../models/returnRequestModel.js";
import OrderModel from "../models/orderModel.js";
import UserModel from "../models/userModel.js";

//Create Return Request
const createReturnRequest=async(req,res)=>{
    try{
        const{user,order,items}=req.body;
        if(!user || !order || items.length===0){
            return res.status(400).json({message:"user,order and items are required"});
        }
        const existingReturnRequest=await ReturnRequestModel.findOne({user,order,status:{$in:["approved","requested"]}});
        if(existingReturnRequest){
            return res.status(400).json({message:"return request already exists"});
        }

        for(const item of items){
            if(item.orderItemIndex===undefined || !item.quantity || !item.reason)
            {
                return res.status(400).json({message:"orderItemIndex,quantity and reason are required"});
            }
            if(item.quantity<1){
                return res.status(400).json({message:"quantity should be greater than 0"});
            }

        }
        const returnRequest=await ReturnRequestModel.create({
            user,
            order,
            items
        });
        return res.status(201).json({message:"return request created successfully",returnRequest});
    }
    catch(error)
    {
        console.log(error.message);
        res.json({message:"Failed to create return request",error:error.message});
    }
};

//Get All Return Requests
const getAllReturnRequests=async(req,res)=>{
    try{
        const returnRequests=await ReturnRequestModel.find()
        .populate("user","name email")
        .populate("order")
        .sort({createdAt:-1});
        return res.status(200).json({message:"return requests fetched successfully",returnRequests});    
    }
    catch(error){
        console.log(error.message);
        res.json({message:"Failed to get all return requests",error:error.message});
    }
};


//Return Request Of One User

const getReturnRequestOfUser=async(req,res)=>{
    try{
        const {userId}=req.params;
        const returnRequests=await ReturnRequestModel.find({user:userId})
        .populate("user","name email")
        .populate("order")
        .sort({createdAt:-1});
        return res.status(200).json({message:"return requests fetched successfully",returnRequests});    
    }
    catch(error){
        console.log(error.message);
        res.json({message:"Failed to get return request of user",error:error.message});
    }
};
 

//Get Single Return Request
const getSingleReturnRequest=async(req,res)=>{
    try{
        const {returnRequestId}=req.params;
        const returnRequest=await ReturnRequestModel.findById(returnRequestId)
        .populate("user","name email")
        .populate("order");
        if(!returnRequest){
            return res.status(404).json({message:"return request not found"});
        }   
        return res.status(200).json({message:"return request fetched successfully",returnRequest});
    }
    catch(error){
        console.log(error.message);
        res.json({message:"Failed to get return request",error:error.message});
    }
};

//Update Return Request
const updateReturnRequest=async(req,res)=>{
    try{
        const {returnRequestId}=req.params;
        const{status,adminNote}=req.body;
        const allowedStatus=["requested","approved","rejected","refunded"];
        if(!status || !allowedStatus.includes(status)){
            return res.status(400).json({message:"status should be one of these "+allowedStatus.join(",")});
        }
        const returnRequest=await ReturnRequestModel.findById(returnRequestId);
        if(!returnRequest){
            return res.status(404).json({message:"return request not found"});
        }
        returnRequest.status=status;
        returnRequest.adminNote=adminNote;
        

        if(status==="approved" || status==="rejected" || status==="refunded"){
            returnRequest.resolvedAt=Date.now();
        }
        await returnRequest.save();
        return res.status(200).json({message:"return request updated successfully",returnRequest});
    }
    catch(error){
        console.log(error.message);
        res.json({message:"Failed to update return request",error:error.message});
    }
};
       
////Delete Return Request
const deleteReturnRequest=async(req,res)=>{
    try{
        const {returnRequestId}=req.params;
        const returnRequest=await ReturnRequestModel.findById(returnRequestId);
        if(!returnRequest){
            return res.status(404).json({message:"return request not found"});
        }
        await ReturnRequestModel.findByIdAndDelete(returnRequestId);
        return res.status(200).json({message:"return request deleted successfully"});
    }
    catch(error){
        console.log(error.message); 
        res.json({message:"Failed to delete return request",error:error.message});  
    }
}

export{
    createReturnRequest,
    getAllReturnRequests,
    getReturnRequestOfUser,
    getSingleReturnRequest,
    updateReturnRequest,
    deleteReturnRequest
}
