import Express from "express"
import http from "http"
import app from "./app"
import socketio from "socket.io"
import cors from "cors"
import uuid from "./functions/uuid"
import { default as jwt } from "jsonwebtoken"
import { default as connection } from "./database"
import { default as auth } from "./controllers/auth"
import userModel from "./models/User"
import ticketModel from "./models/Ticket"
import stackModel from "./models/stack"
import rolModel from "./models/Rol"
import chatModel from "./models/Chat"
import { default as Schema } from "./models/Schema2"
// import {default as model} from "./models/Model2"


app.use(cors())

const server = http.createServer(app)
const port = 7474

const io = socketio(server, {cors: {
    origin: "*",
    methods: ["GET", "POST","PACTH","PUT","DELETE"],
    allow_headers:["x-access-token"],
    credentials:true
  }})

server.listen(port)
io.on('connection', (socket) => { 
    socket.emit("message","ping pong from back")
    console.log(socket.id)
    socket.on("onjoin",(username,room) => {
        console.log(`this is the id from client ${socket.id}, ${room}, ${username}`)
        socket.join(room)
        io.to(room).emit("onjoin","hola")
        console.log(io.sockets)
    })

    // socket.on("private message", (anotherSocketId, msg) => {
    //     console.log(`socket: ${anotherSocketId}, msg: ${msg}`)
    //     io.to(anotherSocketId).emit("private message", socket.id, "pong")
    //     console.log("finish")
    //   })
})

io.on('connection', (socket) => {

    // socket.on("loggedin", async (data) => {
    //     let addstack = new stackModel({
    // //         username: data.username
    // //     })
    //     socker.username = data.username
    //     await addstack.save()
    // })
    socket.on("want-to-chat", async (data) => {
        io.emit("Consultant", socket.id)
    })
    socket.on("accept-chat", async (data) => {
        const ticket = new ticketModel(
            {
                ticket: uuid()
            }
        )
        ticket.save( async (error,doc)=>{
            const chat = new chatModel(
                {
                    _id: new Schema.Types.ObjectId(),
                    ticket:doc.id
                }
            )
            doc.chat = chat._id
            await chat._id
        })
    })
    socket.on("disconnect", async () => {
        console.log(`${socket.username} has left the party.`);
        io.emit("userLeft", socket.username);
        await stackModel.deleteOne({ username: socket.username })
    })
})