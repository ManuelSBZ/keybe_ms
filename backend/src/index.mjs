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
import messageModel from "./models/Message"
// import {default as model} from "./models/Model2"


app.use(cors())

const server = http.createServer(app)
const port = 7474

const io = socketio(server, {
    cors: {
        origin: "http://localhost:8080",
        methods: ["GET", "POST", "PACTH", "PUT", "DELETE"],
        allow_headers: ["x-access-token"],
        credentials: true
    }
})

server.listen(port)
// io.on('connection', (socket) => { 
//     socket.emit("message","ping pong from back")
//     console.log(socket.id)
//     socket.on("onjoin",(username,room) => {
//         console.log(`this is the id from client ${socket.id}, ${room}, ${username}`)
//         socket.join(room)
//         io.to(room).emit("onjoin","hola")
//         console.log(io.sockets)
//     })

// socket.on("private message", (anotherSocketId, msg) => {
//     console.log(`socket: ${anotherSocketId}, msg: ${msg}`)
//     io.to(anotherSocketId).emit("private message", socket.id, "pong")
//     console.log("finish")
//   })
// })
let consultants = { able: {}, unable: {} }
let sockets = {}
io.on('connection', (socket) => {
    console.log(`se conectado el socket : ${socket.id}`)
    socket.on("identity", user => {
        socket.username = user.username
        sockets[socket.id] = socket
        if (String(user.rol) === "1") {
            //Consultants
            console.log(`this is the user${JSON.stringify(user)}`)
            let consultant = { [user.username]:socket.id }
            console.log(`this is the consultant${consultant}`)
            consultants.able = { ...consultants.able, ...consultant }
            console.log(`actual consultant's list (connected): ${JSON.stringify(consultants)}`)
        } else {
            if (Object.entries(consultants.able).length) {
                //Basics
                const chat = new chatModel({})
                chat.save((error, chatCreated) => {
                    if (error) console.log(error)
                    console.log(`JOIN TO CHAT WITH ID ${chatCreated.chatId}`)
                    socket.join(chatCreated.chatId) // sincronizar cliente
                    let consultant = Object.entries(consultants.able)[0]
                    const USERNAME = consultant[0]
                    const ID = consultant[1]
                    delete consultants.able[USERNAME]
                    consultants.unable[USERNAME] = chatCreated.chatId
                    const suporter = sockets[ID]
                    suporter.join(chatCreated.chatId)// sincronizar cliente
                    suporter.receiver = USERNAME
                    suporter.chatId =chatCreated.chatId
                    socket.receiver = suporter.username
                    socket.chatId = chatCreated.chatId
                })
            }
        }

    })

    // AUN NO SE PUEDE CONECTAR A DOS USUARIOS
    socket.on("send-message", async data => {
        console.log("SEND-MESSAGE")
        console.log(`ROOM : ${socket.chatId}`)
        let message = new messageModel(
            {
                sender: socket.username,
                message: data.message,
                receiver: socket.receiver
            }
        )
        const MESSAGE = await message.save()
        console.log(data.chatId)
        // const chatId = data.chatId || false
        const ticket = data.ticket || false
        if (ticket && socket.chatId) {
            console.log("ticket")
        } else if (socket.chatId) {
            const chat = await chatModel.findOne({ "chatId": socket.chatId })
                .populate("messages")
                .exec(async (error, chatFounded) => {
                    if (error) console.log(error)
                    chatFounded.messages.push(message)
                    chatFounded.save()
                    io.to(socket.chatId).emit("sending-chat", chatFounded)
                }

                )
        }
        // else {
        //     const chat = new chatModel(
        //         {
        //             messages: [MESSAGE]//PORNE ID ?
        //         }
        //     )
        //     chat.save(async (error, chat) => {
        //         if (error) console.log(error)
        //         else {
        //             console.log("sendinf messageeeeeeeeee")
        //             const CHAT = await chat.populate("Message")
        //             console.log(`es es el chat INICIAL populate en send-message: ${JSON.stringify(CHAT)}`)
        //             io.emit("sending-chat", CHAT)
        //         }
        //     })
        // }
        // message.save((error, msg) => {
        //     console.log(msg)
        //     const data = {
        //         sender: msg.sender,
        //         receiver: msg.receiver,
        //         message: msg.message,
        //         date: msg.date
        //     }
        //     console.log(`esta es la data antes de ser devuelta\
        //                                  ${JSON.stringify(data)}`)
        //     console.log("resend message")
        //     let chat = messageModel.find({
        //         sender: data.sender, receiver: data.receiver
        //     }, (error, chat) => {
        //         io.emit("resend-message", chat)
        // })
        // })



    })

    socket.on("done-consultant", data =>{
        consultants.unable[socket.username] = socket.id
        consultants.able = {...consultants.able,...consultants.unable[socket.username]}
    })


    // socket.on("want-to-chat", (data) => {
    //     io.emit("Consultant", socket.id, `hola`)
    // })
    // socket.on("accept-chat", async (data) => {
    //     const ticket = new ticketModel(
    //         {
    //             ticket: uuid()
    //         }
    //     )
    //     ticket.save(async (error, doc) => {
    //         const chat = new chatModel(
    //             {
    //                 _id: new Schema.Types.ObjectId(),
    //                 ticket: doc.id
    //             }
    //         )
    //         doc.chat = chat._id
    //         await chat._id
    //     })
    socket.on("disconnect", async () => {
        console.log(`${socket.username}:${socket.id} has left the party.`);
        if (consultants.able.hasOwnProperty(socket.username)) {
            console.log(` result if ${true}`)
            console.log(`actual list of consultants: ${JSON.stringify(consultants)}`)
            delete consultants.able[socket.username]
            console.log(`actual constultant's list ${JSON.stringify(consultants)}`)
        } else if (consultants.unable.hasOwnProperty(socket.username)) {
            console.log(`disconnect: ${socket.username}`)
            console.log(`actual list of consultants: ${JSON.stringify(consultants)}`)
            delete consultants.unable[socket.username] // problema desaparece de la lista
            console.log(`actual consultant's list ${JSON.stringify(consultants)}`)
        }
    })
})
