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
import {default as model} from "./models/Model2"


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

let consultants = {able: {},unable: {}}
let waiting = []
let sockets = {}
io.on('connection', (socket) => {
    socket.on("identity", user => {
        socket.username = user.username
        sockets[socket.id] = socket
        console.log(`se conectado el socket : ${socket.id} - ${socket.username}`)

        if (String(user.rol) === "1") {
            //Consultants
            console.log(`this is the user${JSON.stringify(user)}`)
            let consultant = { [user.username]: socket.id }
            console.log(`actual socket's list ${JSON.stringify(Object.keys(sockets))}`)
            consultants.able = { ...consultants.able, ...consultant }
            console.log(`actual consultant's list (connected): ${JSON.stringify(consultants)}`)
        } else {
            if (Object.entries(consultants.able).length > 0 && Object.entries(sockets).length>0) {
                //Basics
                const chat = new chatModel({})
                chat.save((error, chatCreated) => {
                    console.log(`actual socket's list ${JSON.stringify(Object.keys(sockets))}`)
                    console.log(`actual consultant's list (connected): ${JSON.stringify(consultants)}`)
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
                    suporter.receiver = socket.username
                    suporter.receiverId = socket.id
                    suporter.chatId = chatCreated.chatId
                    socket.receiver = suporter.username
                    socket.receiverId= suporter.id
                    socket.chatId = chatCreated.chatId
                    console.log(`actual socket's list ${JSON.stringify(Object.keys(sockets))}`)
                    console.log(`actual consultant's list (connected): ${JSON.stringify(consultants)}`)
                })
            }else {

                console.log("there is not consultant")
                console.log(`actual consultant's list (connected): ${JSON.stringify(consultants)}`)
                waiting.push(socket)

}        }

    })

    socket.on("match-chat-ticket",(user, ticketId) =>{
        console.log(`match-chat-ticket actual socket's list ${JSON.stringify(Object.keys(sockets))}`)
        console.log(`match-chat-ticketactual consultant's list (connected): ${JSON.stringify(consultants)}`)
        socket.username = user.username
        sockets[socket.id] = socket
        console.log(`se conectado el socket : ${socket.id} - ${socket.username}, haciendo matching`)
        chatModel.findOne({"ticket":ticketId}).populate("messages").exec((error,chatFound)=>{
            if (Object.entries(consultants.able).length) {
                    if (error) console.log(error)
                    console.log(`JOIN TO CHAT WITH ID ${chatFound.chatId}`)
                    socket.join(chatFound.chatId) // sincronizar cliente
                    let consultant = Object.entries(consultants.able)[0]
                    const USERNAME = consultant[0]
                    const ID = consultant[1]
                    delete consultants.able[USERNAME]
                    consultants.unable[USERNAME] = chatFound.chatId
                    const suporter = sockets[ID]
                    suporter.join(chatFound.chatId)// sincronizar cliente
                    suporter.receiver = socket.username
                    suporter.receiverId = socket.id
                    suporter.chatId = chatFound.chatId
                    socket.receiver = suporter.username
                    socket.receiverId = suporter.id
                    socket.chatId = chatFound.chatId
                    console.log(`actual socket's list ${JSON.stringify(Object.keys(sockets))}`)
                    console.log(`actual consultant's list (connected): ${JSON.stringify(consultants)}`)
                    // console.log(`${}`)
                    io.to(chatFound.chatId).emit("sending-chat", chatFound)
            }else console.log("no match tickettttttttttttt")
        })
    })

    socket.on("send-message", async data => {
        console.log("event send-message")
        let message = new messageModel(
            {
                sender: socket.username,
                message: data.message,
                receiver: socket.receiver
            }
        )
        const MESSAGE = await message.save()
        if (socket.chatId) {
            console.log(`sending message to existing chat ${data.message}`)
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


    })


    socket.on("generate-ticket", () => {
        chatModel.findOne({ "chatId": socket.chatId })
            .populate("messages")
            .exec(async (error, chatFounded) => {
                console.log("dentro de exec")
                if (error) console.log(error)
                let ticketObject = new ticketModel(
                    {
                        chat: chatFounded
                    }
                )
                console.log(`going to save ticketObject ${JSON.stringify(ticketObject)}`)
                await ticketObject.save(async (error, ticketObj) => {
                    let messageTicket = new messageModel(
                        {
                            sender: socket.username,
                            message: `this is your ticket : ${ticketObj.ticket}`,
                            receiver: socket.receiver
                        }
                    )
                    console.log(`going to save messageticket ${JSON.stringify(messageTicket)}`)

                    await messageTicket.save(async (error, msg) => {
                        chatFounded.messages.push(messageTicket)
                        chatFounded.ticket = ticketObject.toJSON().ticket
                        console.log(`going to save chatFounded ${JSON.stringify(chatFounded)}`)

                        await chatFounded.save()
                        io.to(socket.chatId).emit("sending-chat", chatFounded)

                    })

                })

            }

            )

    }
    )
    socket.on("done-consultant", data => {
        console.log(`actual consultant's list ${JSON.stringify(consultants)}`)
        consultants.able = {...consultants.able, [socket.username]:socket.id}
        delete consultants.unable[socket.username]
        // consultants.unable[socket.username] = socket.id
        // consultants.able = { ...consultants.able, ...consultants.unable[socket.username] }
        console.log(`actual consultant's list ${JSON.stringify(consultants)}`)
    })


    socket.on("disconnect", async () => {
        console.log(`${socket.username}:${socket.id} has left the party.`);
        if (consultants.able.hasOwnProperty(socket.username)) {
            console.log("CONSULTANT LEFT THE ROOM")
            console.log(` result if ${true}`)
            console.log(`actual list of consultants: ${JSON.stringify(consultants)}`)
            delete consultants.able[socket.username]
            delete consultants.unable[socket.username] // problema desaparece de la lista

            console.log(`actual constultant's list ${JSON.stringify(consultants)}`)
        } else if (consultants.unable.hasOwnProperty(socket.username)) {
            console.log("CONSULTANT LEFT THE ROOM")

            console.log(`disconnect: ${socket.username}`)
            console.log(`actual list of consultants: ${JSON.stringify(consultants)}`)
            delete consultants.unable[socket.username] // problema desaparece de la lista
            delete consultants.able[socket.username] // problema desaparece de la lista

            console.log(`actual consultant's list ${JSON.stringify(consultants)}`)
        } else if (socket.receiver){
            console.log("BASIC LEFT THE ROOM")
            console.log(`actual consultant's list ${JSON.stringify(consultants)}`)
            consultants.able = {...consultants.able, [socket.receiver]:socket.receiverId}
            delete consultants.unable[socket.receiver]

            console.log(`actual consultant's list ${JSON.stringify(consultants)}`)

        }
        console.log(`actual socket's list ${JSON.stringify(Object.keys(sockets))}`)
        delete sockets[socket.id]
        console.log(`actual socket's list ${JSON.stringify(Object.keys(sockets))}`)


    })
})
