const SocketActions = require('./constants')

const Transaction = require('./models/transaction')
const Blockchain = require('./models/chain')

const socketListeners = (socket, chain) => {
    socket.on(SocketActions.ADD_TRANSACTION, (sender, receiver, amount) => {
        const transaction = new Transaction(sender, receiver, amount)
        chain.newTransaction(transaction)
        console.info(`added transaction: ${JSON.stringify(transaction.getDetails, null, '\t')}`)
    })

    socket.on(SocketActions.END_MINING, (newChain) => {
        console.log('end mining encountered')
        process.env.BREAK = true
        const blockchain = new Blockchain()
        blockchain.parseChain(newChain)
        if (blockchain.checkValidity && blockchain.getLength >= chain.getLength) {
            chain.blocks = blockchain.blocks
        }
    })
    return socket
}

module.exports = socketListeners
