const { Mongoose } = require("mongoose");

const mongoose = require("Mongoose")

mongoose.connect("mongodb+srv://manuel:keybe@mansb.xdqr2.mongodb.net/keybe?retryWrites=true&w=majority", {
    useUnifiedTopology: true,
    useNewUrlParser: true
})
.then(db => console.log("DATABASE IS CONNECTED"))

