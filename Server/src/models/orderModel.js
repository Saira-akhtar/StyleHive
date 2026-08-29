import mongoose from "mongoose";

const orderSchema=new mongoose.Schema({
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true
    
    },
    orderNumber:{
        type:String,
        required:true,
        unique:true
    },

    items:[{
        product:{
            type:mongoose.Schema.Types.ObjectId,
            ref:"Product",
            required:true
        },
        quantity:{
            type:Number,
            required:true
        },
        name:{
            type:String,    
            required:true
        },
        color:{
            type:String,
        },
        size:{
            type:String,
        },
        unitPrice:{
            type:Number,
            required:true
        },
        lineTotal:{
            type:Number,
            required:true
        }
    }],

    shippingAddress:{
        type:String,
    },
    pricing:{
        subtotal:{
            type:Number,
            required:true
        },
        discount:{
            type:Number,
            default:0
            
        },
        shipping:{
            type:Number,
            required:true
         },
         tax:{
             type:Number,
             default:0
         },
          total:{
              type:Number,
              require:true
          }

    },
    couponCode:{
        type:String,
    },
    status:{
        type:String,
        enum:["pending","processing","cancelled","shipped","delivered","returned"],
       
    },

    payment:{
        provider:{
            type:String,
            enum:["stripe","paypal","jazzcash","easypaisa"],
            required:true
        },
        paymentId:{
            type:String,
            required:true
        },
        status:{
            type:String,
            enum:["paid","pending","failed","unpaid"],
            required:true
        },
        paidDate:{
            type:Date,
            default:null
        }
    },
    createdAt:{
        type:Date,
        default:Date.now
    },
    updatedAt:{
        type:Date,
        default:Date.now
    }
    
})

const OrderModel=mongoose.model("order",orderSchema);

export default OrderModel;
   