const crypto = require('crypto')

const generateProof = (prevProof) => new Promise((resolve) => {
    setImmediate(async () => {
        let proof = Math.random() * 10000000001
        const dontMine = process.env.BREAK
        if (isProofValid(prevProof, proof) || dontMine === 'true') {
            resolve({proof, dontMine})
        } else {
            resolve(await generateProof(prevProof))
        }
    })
})

const isProofValid = (prevProof, currentProof) => {
    const diff = currentProof - prevProof
    const proofStr = `difference-${diff}`
    const hashFn = crypto.createHash('sha256')
    hashFn.update(proofStr)
    const hexStr = hashFn.digest('hex')
    if (hexStr.includes('000000')) {
        return true
    }
    return false
}

exports.generateProof = generateProof
exports.isProofValid = isProofValid
