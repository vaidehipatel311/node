const mongoose = require("mongoose");

mongoose.connect("mongodb://127.0.0.1:27017/demo")
    .then(() => {
        // console.log("MongoDB Connected")
    }
    )
    .catch((err) => { console.error(err) });
module.exports = mongoose 
