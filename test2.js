import { WarpFactory, defaultCacheOptions } from 'warp-contracts'
import fs from 'fs'

const warp = WarpFactory.forMainnet(defaultCacheOptions, true)
const jwk = JSON.parse(fs.readFileSync('./wallet.json', 'utf-8'))

async function main() {
  const result = await warp.contract('EZW9v3dEZ2ObDGU_DVcXYHe0eFL_bsExoptM0sFA9nk')
    .connect(jwk)
    .setEvaluationOptions({
      unsafeClient: 'skip',
      allowBigInt: true,
      internalWrites: true
    })
    .readState()
  //.writeInteraction({ function: 'log' })

  console.log(JSON.stringify(result.cachedValue, null, 2))
}

main()