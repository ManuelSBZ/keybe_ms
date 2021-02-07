const { Schema, model } = require("Mongoose")
const uuid= require("../functions/uuid")
const chatSchema = new Schema(
    {
        messages: [{type: Schema.Types.ObjectId, ref:"Message"}
        ],
        chatId:{type:String, default:uuid, unique:true},
        ticket: {type: Schema.Types.ObjectId, ref:"Ticket"},

    }
)

module.exports = model("Chat", chatSchema)
