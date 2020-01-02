const crypto = require('crypto')

const Transaction = require('./transaction')

class Block {
    constructor(index, prevHash, prevProof, transactions) {
        this.index = index
        this.proof = prevProof
        this.prevHash = prevHash
        this.transactions = transactions
        this.timestamp = Date.now()
    }

    hashValue() {
        const { index, proof, transactions, timestamp } = this
        const blockString = `${index}-${proof}-${JSON.stringify(transactions)}-${timestamp}`
        const hashFn = crypto.createHash('sha256')
        hashFn.update(blockString)
        return hashFn.digest('hex')
    }

    setProof(proof) {
        this.proof = proof
    }

    getProof() {
        return this.proof
    }

    getIndex() {
        return this.index
    }

    getPrevHash() {
        return this.prevHash
    }

    getDetails() {
        const { index, proof, prevHash, transactions, timestamp } = this
        return {
            index,
            proof,
            prevHash,
            timestamp,
            transactions: transactions.map(transaction => transaction.getDetails())
        }
    }

    parseBlock() {
        this.index = block.index
        this.proof = block.proof
        this.prevHash = block.prevHash
        this.timestamp = block.timestamp
        this.transactions = block.transactions.map(transaction => {
            const parsedTransaction = new Transaction()
            parsedTransaction.parseTransaction(transaction)
            return parsedTransaction
        })
    }

    printTransactions() {
        this.transactions.forEach(transaction => console.log(transaction))
    }
}

module.exports = Block
