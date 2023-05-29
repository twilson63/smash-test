import { WarpFactory } from 'warp-contracts'

const warp = WarpFactory.forMainnet()

async function main() {
  const result = await warp.contract('_yUdq2NKOM_lCCDWlk6TV3FhQpPtkdUj6rGZ3QujiLA')
    .setEvaluationOptions({
      allowBigInt: true,
      internalWrites: true,
      unsafeClient: 'skip'
    })
    .readState()

  console.log(JSON.stringify(result.cachedValue, null, 2))
}

main()