const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt  = require("jsonwebtoken");

const userSchema = new mongoose.Schema({
  firstName: { type: String, default: null },
  lastName: { type: String, default: null },
  email: { type: String, unique: true },
  password: { type: String },
  phoneNumber: { type: String, unique: true },
  token: { type: String },
});

// using methods because using instances of User inside index file\
// creating auth token
userSchema.methods.generateAuthToken = async function(){

  try{
    const token =  jwt.sign({_id:this._id.toString()}, "cvmakermernprojectgoingtobelivesoon",{
      //expiresIn: '15 minutes'
    });
    //await this.save();
    return token;
  }
  catch(error){
    console.log(error)
  }

}

// converting password to hash
userSchema.pre("save",async function(next){
  if(this.isModified("password")){
    const encrptPass = await bcrypt.hash(this.password,10);
    this.password = encrptPass;
    next();
  }
})

module.exports = mongoose.model("users", userSchema);