import * as anchor from '@coral-xyz/anchor';
import { Program } from '@coral-xyz/anchor';
import { TokenLottery } from '../target/types/token_lottery';
import { TOKEN_PROGRAM_ID } from '@solana/spl-token';

describe('token-lottery', () => {
  // Configure the client to use the local cluster.
  anchor.setProvider(anchor.AnchorProvider.env());

  const program = anchor.workspace.token_lottery as Program<TokenLottery>;
  const TOKEN_METADATA_PROGRAM_ID = new anchor.web3.PublicKey('metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s');

  it('should run the program', async () => {
    // Add your test here.
   const mint = anchor.web3.PublicKey.findProgramAddressSync(
    [Buffer.from('collection_mint')],
    program.programId
   )[0];

   const metadata = anchor.web3.PublicKey.findProgramAddressSync(
    [Buffer.from('metadata'), TOKEN_METADATA_PROGRAM_ID.toBuffer(), mint.toBuffer()],
      TOKEN_METADATA_PROGRAM_ID
   )[0]

   const masterEdition = anchor.web3.PublicKey.findProgramAddressSync(
    [Buffer.from('metadata'), TOKEN_METADATA_PROGRAM_ID.toBuffer(), mint.toBuffer(), Buffer.from('edition')],
    TOKEN_METADATA_PROGRAM_ID
   )[0]

   const initConfigIx = await program.methods.initializeConfig(
    new anchor.BN( 10),
    new anchor.BN(10000),
    new anchor.BN(200)
   ).instruction();


   const initLotteryIx = await program.methods.initializeLottery()
   .accounts({
   masterEdition: masterEdition,
   metadata: metadata,
   tokenProgram: TOKEN_PROGRAM_ID,
 })


 .instruction();

   const blockhashContext = await program.provider.connection.getLatestBlockhash();

   const tx = new anchor.web3.Transaction({
    blockhash: blockhashContext.blockhash,
    lastValidBlockHeight: blockhashContext.lastValidBlockHeight,
    feePayer: program.provider.wallet.payer.publicKey
   })
   .add(initConfigIx)
   .add(initLotteryIx);


   
   const sig = await anchor.web3.sendAndConfirmTransaction(program.provider.connection, tx, [program.provider.wallet.payer], {skipPreflight: true});
   console.log(sig);
})

it("buying tickets", async () => {
  const ix = await program.methods.buyTicket()
  .accounts({
  tokenProgram: TOKEN_PROGRAM_ID
  })
  .instruction();


  const blockhashContext = await program.provider.connection.getLatestBlockhash();

    const computeIx = anchor.web3.ComputeBudgetProgram.setComputeUnitLimit({
     units: 300000
    });

    const priorityIx = anchor.web3.ComputeBudgetProgram.setComputeUnitPrice({
      microLamports: 1
    });

    const tx = new anchor.web3.Transaction({
      blockhash: blockhashContext.blockhash,
      feePayer: program.provider.wallet.payer.publicKey,
      lastValidBlockHeight: blockhashContext.lastValidBlockHeight
    })
    .add(ix)
    .add(priorityIx)
    .add(computeIx);

    const sig = await anchor.web3.sendAndConfirmTransaction(program.provider.connection, tx, [program.provider.wallet.payer], {skipPreflight: true});
    console.log(sig)
})
})
