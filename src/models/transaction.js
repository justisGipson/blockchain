class Transaction {
    constructor(sender, reciever, amount) {
        this.sender = sender
        this.reciever = reciever
        this.amount = amount
        this.timestamp = Date.now()
    }

    getDetails() {
        const { sender, reciever, amount, timestamp } = this
        return {
            sender,
            reciever, 
            amount,
            timestamp
        }
    }

    parseTransaction(transaction) {
        this.sender = transaction.sender
        this.reciever = transaction.reciever
        this.amount = transaction.amount
        this.timestamp = transaction.timestamp
    }
}

module.exports = Transaction
