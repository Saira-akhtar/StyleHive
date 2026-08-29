import mongoose from "mongoose";

const couponSchema=new mongoose.Schema({
    code:{
        type:String,
        required:true,
        unique:true,
        uppercase:true,


    },
    discountType:{
        type:String,
        required:true,
        enum:["percentage","fixed"]
    },
    discountValue:{
        type:Number,
        required:true,
    },
    minPurchase:{
        type:Number,
        required:true,
        default:0
    },
    maxDiscount:{
        type:Number,
        required:true,
        default:null
    },

    expireDate:{
        type:Date,
        required:true,
    },
    useageLimit:{
        type:Number,
        default:null
    },
    usedCount:{
        type:Number,
        default:0
    },
    isActive:{
        type:Boolean,
        default:true
    },


});

const CouponModel=mongoose.model("coupon",couponSchema);

export default CouponModel;
