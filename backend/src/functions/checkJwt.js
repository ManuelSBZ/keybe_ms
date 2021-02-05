const config = require("../config")
const jwt = require("jsonwebtoken")
const { json } = require("express")

const checkJwt = (req, res, next) => {
    const token = req.headers["x-access-token"]
    if (!token) {
        return res.status(401).json({
            "authenticated": false,
            'message': 'a valid token is missing'
        })
    }

    jwt.verify(token, config.secret, (error,payload) =>{
        console.log(error)
        if (error) return res.status(401).json({ 
            "authenticated": false,
            'message': 'token is invalid' 
        })
        req.id = payload.id
        next()
    })
}

module.exports = checkJwt