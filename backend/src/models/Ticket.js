const {Schema, model} = require("Mongoose")
const uuid = require("../functions/uuid")
const ticketSchema = new Schema(
    {
        ticket:{type:String, default:uuid, unique:true},

        chat: {type:Schema.Types.ObjectId, ref:"Chat"},
        consultant:{type:String},
        basic:{type:String},
        date: {type: Date, default: Date.now }
    }
)

module.exports = model("Ticket", ticketSchema)
