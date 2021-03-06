const userModel = require("../models/User")
const rolModel = require("../models/Rol")
const chatModel = require("../models/Chat")
const { Router } = require("express")
const auth_object = require("../functions/authentication")
const jwt = require("jsonwebtoken")
const config = require("../config")
const checkJwt = require("../functions/checkJwt")
const router = Router()

router.post("/signup", async (req, res) => {
    data = req.body
    let tag = false
    console.log(Object.entries(data))
    const fields = ["username", "email", "password", "rol"]
    // let documentRol = rolModel.find({rol:1}) 
    fields.forEach((field) => {
        // console.log(data[e])
        if (data[field] === "" || data[field] === null) {
            tag = field
            console.log(`${tag}`)
            return
        }
    })
    // console.log(`este es el id del rol ${documentRol.id}`)
    user = new userModel(
        {
            username: data.username,
            email: data.email,
            password: data.password,
            rol: data.rol
        }
    )
    user.password = user.password ? await user.passwordEncrypt(user.password) : ""

    await user.save(function (error) {
        if (error || tag) {
            console.log(error)
            let msg = tag ? " is required" : " is already in use"
            // validación de campos
            res.status(400).json({
                "created": false,
                "message": `${tag || Object.keys(error.keyValue)[0]}` + msg
            })
        } else {
            res.json({
                "created": true,
                "message": "user created"
            })
        }
    })

})


router.get("/getToken", async (req, res) => {
    let auth = req.headers.authorization
    auth = auth_object(auth, res)
    console.log(Object.entries(auth))
    userModel.findOne({ username: auth.username }, async (error, user) => {
        if (user === null) {
            res.status(401)
                .set({ 'WWW.Authentication': 'Basic realm: "login required"' })
                .json({
                    "authenticated": false,
                    "message": "user does not exist"
                })
        } else {
            let valid_password = await user.comparePassword(auth.password)
            if (!valid_password) {
                res.status(401)
                    .set({ 'WWW.Authentication': 'Basic realm: "login required"' })
                    .json({
                        "authenticated": false,
                        "message": "password does not match"
                    })
            }
            else {
                let token = jwt.sign({ id: user._id, username: user.username, rol:user.populate().rol }, config.secret, {
                    expiresIn: 1800
                })
                res.json({ "authenticated": true, token })

            }
        }
    })

}
)


router.get("/api/foo", async (req, res, next) => {
    let role = await chatModel.findOne({})
    // let user = new userModel(
    //     {
    //         username: "manue",
    //         email: "maco@gmail.com",
    //         password: "1234123",
    //         rol: role.id

    //     }
    // )
    // user.save()
    // let  role = new rolModel(
    //     {
    //         rol:0
    //     }
    // )
    // role.save()
    // let role = await userModel.findOne({ username: "manues" }).populate("rol")
    console.log(role)
    res.json({ "hello": "hola" })
})

router.get("/validatetoken", checkJwt, (req, res) => {
    res.json({ authenticated: true, message: "token valid" })

})

module.exports = router
