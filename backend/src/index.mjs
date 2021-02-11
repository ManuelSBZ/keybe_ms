import http from "http"
import app from "./app"
import socketio from "socket.io"
import { default as connection } from "./database"
import { default as auth } from "./controllers/auth"
import ticketModel from "./models/Ticket"
import chatModel from "./models/Chat"
import messageModel from "./models/Message"



const server = http.createServer(app)
const port = 7474

const io = socketio(server,
    {
        cors: {
            origin: "http://localhost:8080",
            methods: ["GET", "POST", "PACTH", "PUT", "DELETE"],
            allow_headers: ["x-access-token"],
            credentials: true
        }
    }
)

server.listen(port)

let consultants = { able: {}, unable: {} }
let waiting = []
let sockets = {}
io.on('connection', (socket) => {
    socket.on("identity", user => {
        socket.username = user.username
        sockets[socket.id] = socket
        console.log(`se conectado el socket : ${socket.id} - ${socket.username}`)

        if (String(user.rol) === "1" && waiting.length === 0) {
            //Consultants
            console.log(`this is the user${JSON.stringify(user)}`)
            console.log(`actual socket's list ${JSON.stringify(Object.keys(sockets))}`)
            consultants.able[user.username] = socket.id
            console.log(`actual consultant's list (connected): ${JSON.stringify(consultants)}`)
            io.to(socket.id).emit("connected",false)//eliminar

        }
        if (String(user.rol) === "1" && waiting.length > 0) {
            console.log("CONSULTOR Y BASIC USERRRRRRRRRRRRRRRRRRRRRRRRRRRR")
            const chat = new chatModel({})
            chat.save((error, chatCreated) => {
                if (error) console.log(error)
                const userBasic = waiting.shift()
                socket.join(chatCreated.chatId)// sincronizar cliente
                socket.receiver = userBasic.username
                socket.receiverId = userBasic.id
                socket.chatId = chatCreated.chatId
                userBasic.join(chatCreated.chatId)// sincronizar cliente
                userBasic.receiver = socket.username
                userBasic.receiverId = socket.id
                userBasic.chatId = chatCreated.chatId
                consultants.unable[socket.username] = chatCreated.chatId
                io.to(chatCreated.chatId).emit("connected",true)//eliminar
            })

        }
        if (String(user.rol) === "0" && Object.entries(consultants.able).length > 0) {
            //Basics
            const chat = new chatModel({})
            chat.save((error, chatCreated) => {
                console.log(`actual socket's list ${JSON.stringify(Object.keys(sockets))}`)
                console.log(`actual consultant's list (connected): ${JSON.stringify(consultants)}`)
                if (error) console.log(error)
                console.log(`JOIN TO CHAT WITH ID ${chatCreated.chatId}`)
                socket.join(chatCreated.chatId) // sincronizar cliente
                let consultant = Object.entries(consultants.able)[0]
                const [USERNAME, ID] = [consultant[0], consultant[1]]
                delete consultants.able[USERNAME]
                consultants.unable[USERNAME] = chatCreated.chatId
                const consultantSocket = sockets[ID]
                // console.log(`CONSULTANT ID ${ID}, CONSULTANT ${consultant.length}, SOCKET ${.length}`)
                consultantSocket.join(chatCreated.chatId)// sincronizar cliente
                consultantSocket.receiver = socket.username
                consultantSocket.receiverId = socket.id
                consultantSocket.chatId = chatCreated.chatId
                socket.receiver = consultantSocket.username
                socket.receiverId = consultantSocket.id
                socket.chatId = chatCreated.chatId
                io.to(chatCreated.chatId).emit("connected",true)//eliminar
                console.log(`actual socket's list ${JSON.stringify(Object.keys(sockets))}`)
                console.log(`actual consultant's list (connected): ${JSON.stringify(consultants)}`)
            })
        }else if (String(user.rol) === "0") {

            console.log("there is not consultant")
            console.log(`actual consultant's list (connected): ${JSON.stringify(consultants)}`)
            waiting.push(socket)
            io.to(socket.id).emit("connected",false)//eliminar

        }

    })

    socket.on("match-chat-ticket", (user, ticketId) => {
        console.log(`match-chat-ticket actual socket's list ${JSON.stringify(Object.keys(sockets))}`)
        console.log(`match-chat-ticketactual consultant's list (connected): ${JSON.stringify(consultants)}`)
        socket.username = user.username
        sockets[socket.id] = socket
        console.log(`se conectado el socket : ${socket.id} - ${socket.username}, haciendo matching`)
        chatModel.findOne({ "ticket": ticketId }).populate("messages").exec((error, chatFound) => {
            if (Object.entries(consultants.able).length) {
                if (error) console.log(error)
                console.log(`JOIN TO CHAT WITH ID ${chatFound.chatId}`)
                socket.join(chatFound.chatId) // sincronizar cliente
                let consultant = Object.entries(consultants.able)[0]
                const USERNAME = consultant[0]
                const ID = consultant[1]
                delete consultants.able[USERNAME]
                consultants.unable[USERNAME] = chatFound.chatId
                const consultantSocket = sockets[ID]
                consultantSocket.join(chatFound.chatId)// sincronizar cliente
                consultantSocket.receiver = socket.username
                consultantSocket.receiverId = socket.id
                consultantSocket.chatId = chatFound.chatId
                socket.receiver = consultantSocket.username
                socket.receiverId = consultantSocket.id
                socket.chatId = chatFound.chatId
                console.log(`actual socket's list ${JSON.stringify(Object.keys(sockets))}`)
                console.log(`actual consultant's list (connected): ${JSON.stringify(consultants)}`)
                // console.log(`${}`)
                io.to(chatFound.chatId).emit("sending-chat", chatFound)
                io.to(chatFound.chatId).emit("connected",true)//eliminar
            } else console.log("no match ticket")
        })
    })
    socket.on("show-consultants-sockets", () => {
        console.log("show-consultants-sockets")
        console.log(`waiting size : ${waiting.length}`)
        console.log(`actual socket's list ${JSON.stringify(Object.keys(sockets))}`)
        console.log(`actual consultant's list (connected): ${JSON.stringify(consultants)}`)
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
                .exec(async (error, chatFound) => {
                    if (error) console.log(error)
                    chatFound.messages.push(message)
                    chatFound.save()
                    io.to(socket.chatId).emit("sending-chat", chatFound)
                }

                )
        }

    })
    socket.on("writing", length=>{
        if (length>0) socket.broadcast.to(socket.chatId).emit("setWriting",true)
        else socket.broadcast.to(socket.chatId).emit("setWriting",false)
    }) 

    socket.on("generate-ticket", () => {
        chatModel.findOne({ "chatId": socket.chatId })
            .populate("messages")
            .exec(async (error, chatFound) => {
                console.log("dentro de exec")
                if (error) console.log(error)
                let ticketObject = new ticketModel(
                    {
                        chat: chatFound
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
                        chatFound.messages.push(messageTicket)
                        chatFound.ticket = ticketObject.toJSON().ticket
                        console.log(`going to save chatFound ${JSON.stringify(chatFound)}`)

                        await chatFound.save()
                        io.to(socket.chatId).emit("sending-chat", chatFound)

                    })

                })

            }

            )

    }
    )

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
        } else if (socket.receiver) {
            console.log("BASIC LEFT THE ROOM")
            console.log(`actual consultant's list ${JSON.stringify(consultants)}`)
            consultants.able = socket.receiverId in sockets ? { ...consultants.able, [socket.receiver]: socket.receiverId } : consultants.able
            delete consultants.unable[socket.receiver]
            waiting.shift()
            console.log(`actual consultant's list ${JSON.stringify(consultants)}`)

        }else waiting.shift()
        console.log(`actual socket's list ${JSON.stringify(Object.keys(sockets))}`)
        io.to(socket.chatId).emit("connected",false)
        delete sockets[socket.id]
        console.log(`actual socket's list ${JSON.stringify(Object.keys(sockets))}`)


    })
})
