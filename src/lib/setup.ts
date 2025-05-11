
import { AnchorProvider } from "@coral-xyz/anchor";
import { getLotteryProgram, getLotteryProgramId } from "@project/anchor";
import { TOKEN_PROGRAM_ID } from "@solana/spl-token";
import { AnchorWallet, WalletContextState } from "@solana/wallet-adapter-react";
import { Connection, PublicKey } from "@solana/web3.js";
import { BN } from "bn.js";

const programId = new PublicKey("CVNNFuwGZW7vDVJGFU2j5FK2837rUFJtcfke3vNsyoXr");

const TOKEN_METADATA_PROGRAM_ID = new PublicKey('metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s');




interface CreateLotteryArgs {
    startTime: number;
    endTime: number;
    price: number;
}

export async function getAccounts() {
    const mint = await PublicKey.findProgramAddressSync(
        [Buffer.from('collection_mint')],
        programId
    )[0]

    const metadata = await PublicKey.findProgramAddressSync(
        [Buffer.from('metadata'), TOKEN_METADATA_PROGRAM_ID.toBuffer(), mint.toBuffer()],
        TOKEN_METADATA_PROGRAM_ID
    )[0]

    const masterEdition = await PublicKey.findProgramAddressSync(
        [Buffer.from('metadata'), TOKEN_METADATA_PROGRAM_ID.toBuffer(), mint.toBuffer(), Buffer.from('edition')],
        TOKEN_METADATA_PROGRAM_ID
    )[0]

    return {
        metadata,
        masterEdition
    };
}

export async function useLotteryProgram(wallet: WalletContextState, connection: Connection) {

    const program = getLotteryProgram(new AnchorProvider(connection, wallet as AnchorWallet))

    console.log(program.provider.publicKey?.toBase58())
    const InitializeConfigs = async ({ startTime, endTime, price }: CreateLotteryArgs
    ) => {
        const tx1 = await program.methods
            .initializeConfig(
                new BN(startTime),
                new BN(endTime),
                new BN(price),
            )
            .accounts(
                {
                    payer: program.provider.publicKey
                }
            )
            .rpc();

            let tx2;

       if(tx1) {
            const { metadata, masterEdition } = await getAccounts();
             tx2 = await program.methods
            .initializeLottery()
            .accounts({
                masterEdition: masterEdition,
                metadata: metadata,
                tokenProgram: TOKEN_PROGRAM_ID,
            })
            .rpc()
        }

        console.log(tx2)
        return tx2;

    }

    return {

        InitializeConfigs
    };

}




