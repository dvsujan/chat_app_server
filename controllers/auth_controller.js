const jwt = require("jsonwebtoken");
const User = require("../models/user");
const bcrypt = require("bcrypt");
require("dotenv").config();

const home = (req, res) => {
  res.json({ message: "Home" });
};

const register = async (req, res) => {
  try {
    const { username, email, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const jwt_code = jwt.sign({ email: email }, process.env.JWT_KEY_AUTH);
    const emailSearch = await User.find({ email: email });
    if (emailSearch.length>0) {
      throw new Error("Email already exists");
    }
    const usernameSearch = await User.find({username:username}); 
    
    if(usernameSearch.length>0){ 
      throw new Error("Username already exists");
    }
    const user = await User.create({
      username,
      email,
      password: hashedPassword,
    });
    res.json({ success:true, message:"successfully regiseterd user" });
  } catch (error) {
    console.log(error); 
    res.status(400).json({ success:false , error: error.message });
  }
}

const login = async(req, res)=>{ 
  try{ 
    const {email , password}    = req.body; 
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.findOne({email:email});
    if(!user){ 
      throw new Error("User not found");
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if(!isMatch){ 
      throw new Error("Incorrect Password");
    }
    const token = jwt.sign({email:User.email,
      username:user.username,
      _id:user._id,
    },process.env.JWT_KEY);
    res.json({success:true,token:token});
  }
  catch(err){ 
    res.status(400).json({error:err.message,success:false});
    console.log(err); 
  }
}

const verify = async(req, res)=>{ 
  try{ 
    const {jwtCode} = req.params;
    const decoded = jwt.verify(jwtCode, process.env.JWT_KEY_AUTH);
    const user = await User.findOne({email:decoded.email});
    if(!user){ 
      throw new Error("User not found");
    }
    user.Active = true;
    await user.save();
    res.json({
      success:true,
      message:"User verified",
    })
  }
  catch(err){ 
    res.status(400).json({
      success:false , 
      message:err.message,
    })
  }
}


const searchUser = async(req, res)=>{ 
  try{ 
    const {username} = req.params;
    const users = await User.find({username:{$regex:username}});
    // send user without password 
    const usersWithoutPassword = users.map((user)=>{ 
      return { 
        username:user.username,
        email:user.email,
        _id:user._id,
        dp: user.dp,
      }
    })
    res.json({success:true,users:usersWithoutPassword});
  }
  catch(err){ 
    console.log(err); 
    res.status(400).json({ 
      success:false , 
      message:err.message,
    })
  }
}

module.exports = {
  home,
  register,
  login,
  verify,
  searchUser,
};