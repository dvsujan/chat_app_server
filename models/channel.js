const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const ChannelSchema = new Schema({ 
    name :{ 
        type:String, 
        require:true , 
    },
    display_picture:{  
        type:String, 
        default:"",
    },
    description:{
        type:String,
        default:"",
    }, 
    users:[{ 
        type:mongoose.Types.ObjectId, 
        ref:'User', 
    }],
    admins:[{ 
        type:mongoose.Types.ObjectId, 
        ref:'User', 
    }]
},{timestamps:true});

const channel = mongoose.model('Channel', ChannelSchema);
module.exports = channel ;  
