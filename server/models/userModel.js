const mongoose = require('mongoose')

const UserSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        unique:true
        
    },
    password:{
        type:String,
        required:true
    },
    role:{
        type:Number,
        default:0
    },
    cart:{
        type:Array,
        default:[]
    }
},{
    timestamps:true //WILL TELL WHEN THE DATA ARE MADE
}
)

const User= mongoose.model('users',UserSchema)
module.exports = User;