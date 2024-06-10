//Controllers: Controllers contain the business 
//logic for handling requests. When a route is 
//matched, the corresponding controller 
//function is called to process the request, 
//interact with the database (using models), 
//and send a response back to the client.

const User = require('../models/userModel.js')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const dotenv = require('dotenv')
dotenv.config()

const userCtrl = {
    register: async(req,res) => {
       try{
           
           const{name,email,password} = req.body;
           const user = await User.findOne({email})
           if(user){
            return res.status(400).json({msg:"Email Already Registered"})
           }
           if(password.length <6){
            return res.status(400).json({msg:"Password Should be atleast 6 characters"});
           }
           //Password Encryption
           const passwordHash = await bcrypt.hash(password,10)

           const newUser = new User({
            // name:req.body.name,
            // email:req.body.email,
            // password:req.body.password
               name,email,password:passwordHash
           })
           await newUser.save();

           //create jwt for authentication
            const accesstoken = createAccessToken({id:newUser._id})
            const refreshtoken = createRefreshToken({id:newUser._id})

           res.cookie('refreshtoken',refreshtoken,{
            httpOnly:true,
            path:'/user/refresh_token'
           })
        //    res.json({msg:"Register Success"})
           res.json({accesstoken})
       }
       catch(err){
        return res.status(500).json({msg:err.message})
       }
    },
    refreshtoken: async(req,res) => {
        try{
            const rf_token = req.cookies.refreshtoken

            if(!rf_token){
                return res.status(400).json({msg:"Please Login or Registers"});
            }
    
                jwt.verify(rf_token,process.env.REFRESH_TOKEN_SECRET,(err,user) => {
                    if(err) return res.status(400).json({msg:"Please Login or Register"})
                    const accesstoken = createAccessToken({id:user.id})
                    res.json({user,accesstoken})
                })
        }
        catch(err){
           return res.status(500).json({msg:err.message})
        }
        
        
    },
    login: async(req,res) => {
        try{
           const{email,password} = req.body

           const user = await User.findOne({email})//In this line, { email } is a shorthand way to create an object with the key email and the value of the variable email. It's equivalent to writing { email: email }.
           if(!user){
            return res.status(400).json({msg:"User doesn't exist"})
           }
           const isMatch = await bcrypt.compare(password,user.password)
           if(!isMatch){
            return res.status(400).json({msg:"Incorrect Password"})
           }

           const accesstoken = createAccessToken({id:user._id})
           const refreshtoken = createRefreshToken({id:user._id})
           res.cookie('refreshtoken',refreshtoken,{
            httpOnly:true,
            path:"user/refresh_token"
           })

          res.json({accesstoken})
          
        }
        catch(err){
            return res.status(500).json({msg:err.message})
        }
    },
    logout: async(req,res) => {
       try{
         res.clearCookie('refreshtoken',{
            path:'/user/refresh_token'
         })
         return res.json({msg:"Log Out"})
       } 
       catch(err){
              
       }
    },
    getUser:async(req,res) =>{
      try{
        const user = await User.findById(req.user.id).select('-password')
        if(!user) return res.status(400).json({msg:"User Not Found"})

        res.json(user)
      }  
      catch(err){
        return res.status(500).json({msg:"err.message"})

      }
    }
    
}
const createAccessToken = (payLoad) => {
    return jwt.sign(payLoad,process.env.ACCESS_TOKEN_SECRET,{expiresIn:'1d'})
}

const createRefreshToken = (payLoad) => {
    return jwt.sign(payLoad,process.env.REFRESH_TOKEN_SECRET,{expiresIn:'7d'})
}
module.exports = userCtrl
