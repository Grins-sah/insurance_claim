import mongoose from "mongoose";


const Schema = mongoose.Schema;

const userSchema = new Schema({
    name:{
        type:String,
    },
    email:{
        type:String,
    },
    password:{
        type:String,
    },
    role:{
        type:String,
    },
    phoneno:{
        type:String,
    },
    state:{
        type:String,
    },
    address:{
        type:String,
    },
    pincode:{
        type:String,
    }

})
export const userSchemaModel = mongoose.model("User",userSchema);

const userFileSchema = new Schema({
    userId:{type:mongoose.Types.ObjectId,ref:'User',required:false},
    filename: String,
    contentType: String,
    data: Buffer,
    uploadDate: { type: Date, default: Date.now }
})

export const fileModel = mongoose.model("File",userFileSchema, "uploads");