const express = require('express')
const mongoose = require('mongoose')
const router = require('./routes/useRoute.js')
const router1 = require('./routes/categoryRoute.js')
const app = express();
const cookieParser = require('cookie-parser')
const fileUpload = require('express-fileupload')

const dotenv = require('dotenv')
dotenv.config()

const PORT = process.env.PORT || 5000

app.use(express.json())
app.use(cookieParser())
app.use(fileUpload({
    useTempFiles:true
}))
app.get('/',(req,res)=> {
    res.json("Hello")
})
app.listen(PORT,()=>{
    console.log(`Server listening on port ${PORT}`)
})

app.use("/user",router)
app.use("/api",router1)
app.use('/api',require('./routes/upload'))
app.use('/api',require('./routes/productRouter'))


const URI = process.env.MONGODB_URI;
mongoose.connect(URI).then(()=>{
    console.log("Database Connected")
}).catch(err => {
    console.log(err)
})
