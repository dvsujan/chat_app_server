const jwt = require("jsonwebtoken");
const Channel = require("../models/channel");
const bcrypt = require("bcrypt");
const User = require("../models/user");
require("dotenv").config();

const  create = async (req, res) => {
    try {
        const {name} = req.body;
        const users = req.body.users || [];
        const admin = req.userData._id;
        const channelSearch = await Channel.find({name:name, admins:admin, users:users});
        if(channelSearch.length>0){
            throw new Error("Channel already exists");
        }
        const uuser = await User.findById(users[0]);
        const channel = await Channel.create({
            name:name,
            admins:[admin],
            users:[admin].concat(users),
            display_picture: uuser.dp,
        });
        res.json({ success:true, channel_id: channel._id, channel_name: channel.name,  });
    } catch (error) {
        console.log(error); 
        res.status(400).json({ success:false , message: error.message });
    }
}
const addAdmin = async(req, res)=>{ 
   try{ 
    const {channel_id} = req.params;
    const {users} = req.body.users||[]; 
    const channel = await Channel.findById(channel_id);
    if(!channel){ 
        throw new Error("Channel not exists");
    }
    const admin = req.userData._id;
    if(channel.admins.indexOf(admin) === -1){ 
        throw new Error("You are not an admin of this channel");
    }
    for(let i=0;i<users.length;i++){ 
        if(channel.admins.indexOf(users[i]) === -1){ 
            channel.admins.push(users[i]);
        }
    }
    res.status(200).json({ 
        success:true, 
        message:"Admin added successfully",
    }); 
   } 
   catch(err){ 
    res.status(400).json({ 
        success:false ,
        message:err.message,
    })
   }
}

const addUser = async(req , res)=>{ 
    try{ 
        const channel = await Channel.findById(req.params.channel_id);
        if(!channel){ 
            throw new Error("Channel Id does not exist");
        }
        const user = req.userData._id;
        if(channel.users.indexOf(user) === -1){ 
            channel.users.push(user);
        }
        res.json({success:true, message:"user added successfully"});
    }
    catch(err){ 
        console.log(err); 
        res.status(400).json({ 
            success:false ,
            message:err.message,
        }); 
    }
}

const removeUser = async(req, res)=>{ 
    try{ 
        const {users} = req.body.users||[]; 
        const channel = await Channel.findById(req.params.channel_id);
        if(!channel){ 
            throw new Error("Channel Id does not exist");
        }
        const admin = req.userData._id;
        for(var i = 0 ; i< users.length; i++ ){ 
            if(channel.users.indexOf(users[i]) !== -1){ 
                channel.users.splice(channel.users.indexOf(users[i]),1);
            }
            if(channel.admins.indexOf(users[i]) !== -1){ 
                channel.admins.splice(channel.admins.indexOf(users[i]),1);
            }
        }
        res.json({success:true, message:"user removed successfully"});

    }
    catch(err){ 
        console.log(err); 
        return res.status(400).json({ 
            success:false ,
            message:err.message,
        })
    }
}

const removeAdmin = async(req, res)=>{ 
    try{ 
        // TODO: remove admin from group 
        return res.json({ 
            success:true, 
        })
    }    
    catch(err){ 
        console.log(err) ; 
        res.status(400).json({ 
            success:false , 
            message:err.message,
        })
    }
}

const deleteChannel = async(req, res)=>{ 
    try{ 
        const channel = await Channel.findById(req.params.channel_id);
        if(!channel){ 
            throw new Error("Channel Id does not exist");
        }
        const admin = req.userData._id;
        if(channel.admins.indexOf(admin) === -1){ 
            throw new Error("You are not an admin of this channel");
        }
        await channel.remove();
        res.json({success:true, message:"Channel deleted successfully"});
    }
    catch(err){ 
        console.log(err); 
        res.status(400).json({ 
            success:false ,
            message:err.message,
        })
    }
}

const leaveChannel = async(req, res)=>{ 
    try{ 
        const channel = await Channel.findById(req.params.channel_id);
        if(!channel){ 
            throw new Error("Channel Id does not exist");
        }
        const user = req.userData._id;
        if(channel.users.indexOf(user) === -1){ 
            throw new Error("You are not a member of this channel");
        }
        channel.users.splice(channel.users.indexOf(user),1);
        channel.admins.splice(channel.admins.indexOf(user),1);
        res.json({success:true, message:"Channel deleted successfully"});
    }
    catch(err){ 
        console.log(err); 
        res.status(400).json({ 
            success:false ,
            message:err.message,
        })
    }
}

const getChannel = async(req, res)=>{
    try{ 
        const channel = await Channel.findById(req.params.channel_id);
        if(!channel){ 
            throw new Error("Channel Id does not exist");
        }
        const user = req.userData._id;
        if(channel.users.indexOf(user) === -1){ 
            throw new Error("You are not a member of this channel");
        }
        res.json({success:true, message:"", channel:channel});
    }
    catch(err){ 
        console.log(err); 
        res.status(400).json({ 
            success:false ,
            message:err.message,
        })
    }
}

const getChannels = async(req, res)=>{ 
    try{ 
        const user = req.userData._id;
        const channels = await Channel.find({users:user});
        console.log(channels); 
        res.json({success:true, message:"", channels:channels});
    }
    catch(err){ 
        console.log("error in get channels"); 
        console.log(err); 
        res.status(400).json({ 
            success:false ,
            message:err.message,
        })
    }
}

module.exports = {
    create , 
    addAdmin , 
    addUser , 
    removeAdmin , 
    removeUser , 
    deleteChannel ,
    leaveChannel ,
    getChannel, 
    getChannels, 
}