const mongoose = require("mongoose");

const schema = new mongoose.Schema({
    text:{
        type:String,
        required:true,
    },
    date:{
        type:Date,
         default: Date.now,
    },
    status: {
      type: String,
      enum: ["pending", "progress", "completed"],
      default: "pending",
    },
})

 const Todo = mongoose.model("Todo", schema)
 module.exports = Todo;