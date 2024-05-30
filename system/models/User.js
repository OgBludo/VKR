import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
    fullname:
    {
        type:String,
        required: true,
    },
    login:
    {
        type:String,
        required:true,
        unique: true,
    },
    passwordHash:
    {
        type: String,
        required: true,
    },
    isAdmin:
    {
        type:Boolean,
        required:true,
    }
},{timestamps:true});

export default mongoose.model('User',UserSchema);