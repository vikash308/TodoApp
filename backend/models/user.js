const mongoose = require("mongoose");
const passportLocalMongoose = require('passport-local-mongoose');

const schema = new mongoose.Schema({
    email:{
        type:String,
        required:true,
    },
    todos:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:"Todo"
        }
    ]
})

schema.plugin(passportLocalMongoose);

 const User = mongoose.model("User", schema)
 module.exports = User;