import mongoose from "mongoose";

const returnRequestSchema=new mongoose.Schema({
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true
    },
    order:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"order",
        required:true
    },
    items:[{
        orderItemIndex:{
            type:Number,
            required:true
        },
        quantity:{
            type:Number,
            required:true,
            min:1
        },
        reason:{
            type:String,
            required:true,
            trim:true
        }
    }],
    status:{
        type:String,
        enum:["requested","approved","rejected","refunded"],
        default:"requested"
    },
    adminNote:{
        type:String,
        trim:true
    },
    createdAt:{
        type:Date,
        default:Date.now
    },
    resolvedAt:{
        type:Date,
        default:null
    }
    });

    const ReturnRequestModel=mongoose.model("ReturnRequest",returnRequestSchema);

    export default ReturnRequestModel;