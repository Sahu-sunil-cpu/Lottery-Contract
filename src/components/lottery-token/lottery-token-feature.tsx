'use client'

import { useWallet } from '@solana/wallet-adapter-react'
import { WalletButton } from '../solana/solana-provider'
//import { VestingCreate, VestingList } from './vesting-ui'
import { AppHero } from '../app-hero'
//import { ellipsify } from '@/lib/utils'
import LotteryPage from './lottery-token-ui'
import { endpoint } from '@/lib/utils'
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui'

export default function LotteryFeature() {
  const wallet  = useWallet()



  return wallet.publicKey ? (
    <div>
      <div className='fixed top-8 left-8'>
      <WalletMultiButton/>
      </div>
   
      <AppHero>
      
        <LotteryPage />
      </AppHero>
      
    </div>
  ) : (
    <div className="max-w-4xl mx-auto">
      <div className="hero py-[64px]">
        <div className="hero-content text-center">
          <WalletButton />
        </div>
      </div>
    </div>
  )
}


export function ExplorerLink({
    path,
    label,
    className,
}: {
    path: string;
    label: string;
    className?: string;
}) {

    return (
        <a
            href={endpoint}
            target="_blank"
            rel="noopener noreferrer"
            className={className ? className : `link font-mono`}
        >
            {label}
        </a>
    );
}
