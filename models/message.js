const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Message = new Schema({ 
    user_id:{ 
        type:String, 
        require:true, 
    },
    channel_id:{ 
        type:String, 
        require:true, 
    },
    content:{ 
        type:String, 
        require:true, 
    },
},{timestamps:true});

const message = mongoose.model('Message', Message);
module.exports = message ;  