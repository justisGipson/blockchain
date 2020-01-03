const express = require('express');
const app = express();
const bodyParser = require('body-parser')
const httpServer = require('http').Server(app)
const axios = require('axios')
const io = require('socket.io')(httpServer)
const client = require('socket.io-client')

const Blockchain = require('./models/chain')
const SocketActions = require('./constants')

const socketListeners = require('./socketListeners')

const { PORT } = process.env

const blockchain = new Blockchain(null, io)

app.use(bodyParser.json())

app.post('/nodes', (req, res) => {
    const { host, port } = req.body
    const { callback } = req.query
    const node = `https://${host}:${port}`
    const socketNode = socketListeners(client(node), blockchain)
    blockchain.addNode(socketNode, blockchain)
    if ( callback === 'true') {
        console.info(`added node ${node} back`)
        res.json({status: 'added node back'}).end()
    } else {
        axios.post(`${node}/nodes?callback=true`, {
            host: req.hostname,
            port: PORT
        })
        console.info(`added node ${node}`)
        res.json({ status: 'added node'}).end()
    }
})

app.post('/transaction', (req, res) => {
    const { sender, receiver, amount } = req.body
    io.emit(SocketActions.ADD_TRANSACTION, sender, receiver, amount)
    res.json({message: 'transaction success'}).end()
})

app.get('/chain', (req, res) => {
    res.json(blockchain.toArray).end()
})

io.on('connection', (socket) => {
    console.info(`socket connected, ID: ${socket.id}`)
    socket.on('disconnect', () => {
        console.log(`socket disconnected, ID: ${socket.id}`)
    })
})

blockchain.addNode(socketListeners(client(`http://localhost:${PORT}`), blockchain))

httpServer.listen(PORT, () => console.info(`Server running on port: ${PORT}...`))
