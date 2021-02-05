const express = require("express")
const auth = require("./controllers/auth")
const cors = require("cors")

app = express()
// app.use(cors("*"))
app.use(express.json())
app.use("/api/auth/",auth)

module.exports = app