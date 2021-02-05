const { Schema, model } = require("Mongoose")
const bcrypt = require("bcryptjs")

const userSchema = new Schema(
    {
        username: { type: String, unique: true, required: true },
        email: { type: String, unique: true, required: true },
        password: { type: String, unique: true, required: true },
        rol: { type: String, ref: "Rol", required: true },
        ticket: [{ type: Schema.Types.ObjectID, ref: "Ticket" }]
    }
) 

userSchema.methods.passwordEncrypt = async (pass) => {
    const salt = await bcrypt.genSalt(10)
    return bcrypt.hash(pass, salt)
}

userSchema.methods.comparePassword = async function (password) {
    return bcrypt.compare(password, this.password);
}
module.exports = model("User", userSchema)
