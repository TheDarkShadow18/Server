const express=require("express");
const app=express();
const cors=require("cors");
const mongoose=require("mongoose");
const dotenv=require("dotenv");
dotenv.config();
let username = process.env.MONGODB_USERNAME;
let password = process.env.MONGODB_PASSWORD;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended:true}));

// mongoose.connect("mongodb://localhost:27017/crudOperations")
// .then(()=>{
//     console.log('Db connected');
// })
// .catch((err)=>{
//     console.log(err);
// })
mongoose.connect(`mongodb+srv://${username}:${password}@crud.ferje.mongodb.net/crudOperations`, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    serverSelectionTimeoutMS: 5000, // Keep trying for 5 seconds
    socketTimeoutMS: 45000, // Close sockets after 45 seconds
})
.then(res => {
    console.log("Connected to MongoDB");
})
.catch(err => {
    console.error("MongoDB connection error:", err);
});
const dataSchema=new mongoose.Schema({
    name:String,
    email:String,
    mobile:String
},{
    timestamps:true
});

const User=mongoose.model("User",dataSchema);


app.get("/",async(req,res)=>{
    const data=await User.find({});

    res.json({success:true,data:data});

})
//Create root

app.post("/create",async(req,res)=>{
    console.log(req.body);
    const user=new User(req.body)
    await user.save();
    res.send({success:true,message:"data saved successfully",data:user});
})

//Update Route
app.put("/update",async(req,res)=>{
    console.log(req.body);
    let {_id,...rest}=req.body;
    console.log(rest);
    const updateData=await User.updateOne({_id:_id},rest);
    res.send({success:true,message:"data updated",data:updateData});
})

//Delete route
// app.delete("/delete/:id",(req,res)=>{
//     let id=req.params.id;
//     console.log(id);
    
//     let deldata=User.deleteOne({_id:id});
//     res.send({success:true,message:"data updated",data:deldata});

// })
app.delete("/delete/:id", async (req, res) => {
    let id = req.params.id;
    console.log("Deleting user with ID:", id);
    
    try {
        const delData = await User.deleteOne({_id: id});
        console.log("Delete result:", delData);  // Log the result of the delete operation
        if (delData.deletedCount === 0) {
            return res.status(404).send({success: false, message: "User not found"});
        }
        res.send({success: true, message: "Data deleted successfully"});
    } catch (error) {
        console.error("Error deleting user:", error); // Log the error for debugging
        res.status(500).send({success: false, message: "Error deleting data"});
    }
});

const port = process.env.PORT || 8080;

app.listen(port,()=>{
    console.log(`server listening on port : ${port}`);
})