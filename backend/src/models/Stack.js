const { Schema, model } = require("Mongoose")

const StackSchema = new Schema(
    {
        stackuser: [{ username: String}]

    }
)

module.exports = model("Stackuser", StackSchema)
