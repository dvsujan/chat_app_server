const express= require('express'); 
const Message = require('../models/message');
const Channel = require("../models/channel")
const User = require("../models/user");

const hello = (req , res)=>{
    res.json({success:true , message:"message"});
}

const addMessage = async(req,res)=>{ 
    try{ 
        const channelId = req.params.channel_id; 
        const content = req.body.message;
        const user = req.userData._id;
        const channel = await Channel.findById(channelId);
        if(!channel){ 
            throw new Error("Channel does not exist");
        }

        const suser = await User.findById(user);
        if(!suser){
            throw new Error("User does not exist");
        }
        const message = await Message.create({
            content:content,
            user_id:user,
            channel_id:channelId,
        }); 
    }
    catch(err){ 
        console.log(err) ;
        res.json({ 
            success:true , 
            message:err.message,
        })
    }
}

const deleteMessage = async(req,res)=>{
    try{ 
       const messageId = req.params.message_id ; 
         const message = await Message.findById(messageId);
            if(!message){ 
                throw new Error("Message does not exist");
            }
            const user = req.userData._id;
            if(message.user_id !== user){ 
                throw new Error("You are not the owner of this message");
            }
            await message.remove();
            res.json({success:true, message:"Message deleted successfully"});
    }
    catch(err){ 
        console.log(err); 
        res.json({ 
            success:false , 
            message:err.message,
        }) 
    }
}

const getMessages = async(req , res)=>{ 
    try{ 
        const channel_id = req.params.channel_id; 
        const page = req.query.page || 1;
        const limit = req.query.limit || 10;
        const channel = await Channel.findById(channel_id);
        if(!channel){ 
            throw new Error("Channel does not exist");
        }
        const user = req.userData._id;
        if(channel.users.indexOf(user) === -1){ 
            throw new Error("User forbidden from the channel");
        }

        const messages = await Message.find({channel_id:channel_id}).sort({createdAt:-1}).skip((page-1)*limit).limit(limit);
        if(messages.length === 0){
            throw new Error("No messages found");
        }
        res.status(200).json({ 
            success:true , 
            messages:messages,
            page:page, 
            limit:limit,
        })
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
    hello,
    addMessage, 
    getMessages, 
    deleteMessage,
}