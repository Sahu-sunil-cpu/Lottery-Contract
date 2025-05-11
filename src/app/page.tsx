
import '@solana/wallet-adapter-react-ui/styles.css';


import LotteryFeature from '@/components/lottery-token/lottery-token-feature'
import { SolanaProvider } from '@/components/solana/solana-provider';

export default function Home() {
  
  return <div>
    <SolanaProvider>
 <LotteryFeature/>
    </SolanaProvider>
  </div>
}
