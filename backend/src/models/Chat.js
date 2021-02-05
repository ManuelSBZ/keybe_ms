const { Schema, model } = require("Mongoose")

const chatSchema = new Schema(
    {
        messages: [{
            sender: { username: String },
            receiver: { username: String },
            message: { type: String },
            date: {type: Date, default: Date.now}
        }
        ],
        ticket: {type: Schema.Types.ObjectId, ref:"Ticket", unique:true},

    }
)

module.exports = model("Chat", chatSchema)
