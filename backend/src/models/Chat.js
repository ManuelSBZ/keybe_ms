const { Schema, model } = require("Mongoose")
const uuid= require("../functions/uuid")
const chatSchema = new Schema(
    {
        messages: [{type: Schema.Types.ObjectId, ref:"Message"}
        ],
        chatSessionId:{type:String, default:uuid, unique=true},
        ticket: {type: Schema.Types.ObjectId, ref:"Ticket", unique:true},

    }
)

module.exports = model("Chat", chatSchema)
