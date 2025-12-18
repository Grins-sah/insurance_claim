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

const userDataSchema = new Schema({

})