const {Schema, model} = require("Mongoose")

const ticketSchema = new Schema(
    {
        ticket:{type:String, unique:true},
        chat: {type:Schema.Types.ObjectId, ref:"Chat"},
        date: {type: Date, default: Date.now }
    }
)

module.exports = model("Ticket", ticketSchema)
