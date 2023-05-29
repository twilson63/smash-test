import fs from 'fs'
import cliProgress from 'cli-progress'
import { WarpFactory, LoggerFactory } from 'warp-contracts'
//import { take } from 'ramda'

LoggerFactory.INST.logLevel('error')
const warp = WarpFactory.forMainnet()
const ids = fs.readFileSync('./ids.txt', 'utf-8').split('\n')

const TOTAL = 1657263496
const SHARE = Math.floor(TOTAL / ids.length)
const jwk = JSON.parse(fs.readFileSync('./wallet.json', 'utf-8'))

async function main() {
  const bar1 = new cliProgress.SingleBar({}, cliProgress.Presets.shades_classic);

  const contract = await warp
    .contract('CGaAQAw1mtKiIAGIwh4bmmZOsgcEGCo6hzWgV6Ua42c')
    .connect(jwk)
    .setEvaluationOptions({
      allowBigInt: true,
      internalWrites: true,
      remoteStateSyncEnabled: true,
      unsafeClient: 'skip'
    })

  const addrs = ids
  const balances = await contract.readState()
    .then(payload => {
      return payload.cachedValue.state.balances
    })

  bar1.start(addrs.length, 0);
  for (var i = 0; i < addrs.length; i++) {
    if ((balances[addrs[i]] || 0) < SHARE) {
      await transfer(contract, addrs[i], SHARE)
    }
    bar1.update(i)
  }
  bar1.stop()
}

main()

async function transfer(contract, target, qty) {
  if (target === '') { return }

  //await new Promise(r => setTimeout(r, 25))

  //console.log('target: ', target)
  return contract.writeInteraction({
    function: 'transfer',
    target,
    qty
  }, {
    strict: true
  })
}