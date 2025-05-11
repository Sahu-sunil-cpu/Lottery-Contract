// Here we export some useful types and functions for interacting with the Anchor program.
import { AnchorProvider, Program } from '@coral-xyz/anchor'
import { Cluster, PublicKey } from '@solana/web3.js'
import LotteryIDL from '../target/idl/token_lottery.json'
import type { TokenLottery } from '../target/types/token_lottery'

// Re-export the generated IDL and type
export { TokenLottery, LotteryIDL }

// The programId is imported from the program IDL.
export const LOTTERY_PROGRAM_ID = new PublicKey(LotteryIDL.address)

// This is a helper function to get the Counter Anchor program.
export function getLotteryProgram(provider: AnchorProvider, address?: PublicKey): Program<TokenLottery> {
  return new Program({ ...LotteryIDL, address: address ? address.toBase58() : LotteryIDL.address } as TokenLottery, provider)
}

// This is a helper function to get the program ID for the Counter program depending on the cluster.
export function getLotteryProgramId(cluster: Cluster) {
  switch (cluster) {
    case 'devnet':
    case 'testnet':
      // This is the program ID for the Counter program on devnet and testnet.
      return new PublicKey('CVNNFuwGZW7vDVJGFU2j5FK2837rUFJtcfke3vNsyoXr')
    case 'mainnet-beta':
    default:
      return LOTTERY_PROGRAM_ID
  }
}
