import { SourceType, WarpFactory } from 'warp-contracts'
import { DeployPlugin, ArweaveSigner } from 'warp-contracts-plugin-deploy'
import fs from 'fs'

const jwk = JSON.parse(fs.readFileSync('./wallet.json', 'utf-8'))
const src = fs.readFileSync('./contract-sample.js', 'utf-8')
const warp = WarpFactory.forMainnet().use(new DeployPlugin())

async function main() {
  const result = await warp.deploy({
    wallet: new ArweaveSigner(jwk),
    src,
    initState: JSON.stringify({
      balances: {
        'vh-NTHVvlKZqRxc8LyyTNok65yQ55a_PJ1zWLb9G2JI': 1657263496
      },
      log: {}
    }),
    evaluationManifest: {
      evaluationOptions: {
        sourceType: SourceType.BOTH,
        allowBigInt: true,
        internalWrites: true,
        unsafeClient: 'skip'
      }
    }
  })
  console.log(result)
}

main()