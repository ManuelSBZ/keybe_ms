const { Schema, model } = require("Mongoose")

const messageSchema = new Schema(
    { 
            sender: { type: String },
            receiver: { type: String },
            message: { type: String },
            date: {type: Date, default: Date.now}
    }
)

module.exports = model("Message", messageSchema)
