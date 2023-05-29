import Arweave from 'arweave'
import fs from 'fs'
//const t2 = fs.readFileSync('./show.mp4')
//const t2 = fs.readFileSync('./tigger.jpeg')
// const host = 'chain-ca-247rack-1.ar.io'
// const port = 1984
// const protocol = 'http'
const host = 'arweave.net'
const port = 443
const protocol = 'https'

const arweave = Arweave.init({ host, port, protocol })
const jwk = JSON.parse(fs.readFileSync('./wallet.json', 'utf-8'))
//const PERCENT = 1.01

async function main() {
  //const reward = await fetch(`${protocol}://${host}:${port}/price/1`).then(r => r.text())
  //const x = Math.floor(Number(reward) * PERCENT)
  //console.log('testing: ', host)
  const tx = await arweave.createTransaction({
    data: '1984',
    //reward: Math.floor(Number(reward) * PERCENT).toString()
  })

  //console.log({ reward: tx.reward })
  await arweave.transactions.sign(tx, jwk)
  await arweave.transactions.post(tx)
  console.log(tx.id)
  const result = await check(tx.id)
  console.log('status: ', result)
}

main()

async function check(txId) {
  console.log('tx', txId)
  return new Promise(async resolve => {
    let waiting = true
    while (waiting) {
      await new Promise(r => setTimeout(r, 6000))
      const { status } = await fetch(`${protocol}://${host}:${port}/tx/${txId}`)
      console.log('status: ' + status)

      if (status !== 202) {
        resolve(status)
        waiting = false
      }

    }
  })
}