const {Schema, model} = require("Mongoose")

const rolSchema = new Schema(
    {
        rol:{type:Number, unique:true}
    }
)

module.exports = model("Rol", rolSchema)
