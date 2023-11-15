const mongoose = require('mongoose');
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const taskSchema = new mongoose.Schema({
 
    ownerid:{
            type : mongoose.Schema.Types.ObjectId , ref:'student'
    },
    
    task:{
        type:String,
    },
    duedate:{
        type:Date,
    },
    description:{
        type:String,
    }
     
},{ timestamps: true });


const task = mongoose.model("task",taskSchema);
module.exports = task;