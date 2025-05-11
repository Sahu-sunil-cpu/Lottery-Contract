'use client'

import { getLotteryProgram, getLotteryProgramId } from '@project/anchor';
import { AnchorWallet, useConnection, useWallet } from "@solana/wallet-adapter-react";
import { Cluster, PublicKey } from "@solana/web3.js";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useMemo } from "react";
import toast from "react-hot-toast";
//import { useCluster } from "../cluster/cluster-data-access";
//import { useAnchorProvider } from "../solana/solana-provider";  
import { AnchorProvider } from '@coral-xyz/anchor';

//import { useTransactionToast } from "../ui/ui-layout";
import { TOKEN_PROGRAM_ID, } from "@solana/spl-token";

import { BN } from "bn.js";
import { ExplorerLink } from "./lottery-token-feature";
import { endpoint } from '@/lib/utils';

interface CreateLotteryArgs {
    startTime: number;
    endTime: number;
    price: number;
}

interface CreateEmployeeArgs {
    startTime: number;
    endTime: number;
    totalAmount: number;
    cliffTime: number;
}

export async function useLotteryProgram() {

    const { connection } = useConnection();
    const wallet = useWallet();

    const ID = getLotteryProgramId('testnet');
    const program = getLotteryProgram(new AnchorProvider(connection, wallet as AnchorWallet))
   

    const InitializeConfigs = async ({startTime, endTime, price}: CreateLotteryArgs) => {
          const tx = await program.methods
          .initializeConfig(
           new BN(startTime),
           new BN(endTime),
           new BN(price), 
          )
          .accounts(
            {
                payer: new PublicKey(ID)
            }
          )
          .rpc();


          console.log(tx)
         
    }

    return {
        ID,
        InitializeConfigs
    };

}

// export async function useLotteryProgram() {
//     const { connection } = useConnection();
//     const wallet = useWallet();
//     // const { cluster } = useCluster();
//     const transactionToast = useTransactionToast();
//     const provider =  new  AnchorProvider(connection, wallet as AnchorWallet, {
//            commitment: 'confirmed',
//           });
//     const programId = useMemo(
//         () => getLotteryProgramId("testnet"),
//         [endpoint]
//     );
//     const program = getLotteryProgram(provider);

//     const accounts = useQuery({
//         queryKey: ["vesting", "all", { endpoint }],
//         queryFn: () => program.account.lotteryToken.all(),
//     });

//     const getProgramAccount = useQuery({
//         queryKey: ["get-program-account", { endpoint }],
//         queryFn: () => connection.getParsedAccountInfo(programId),
//     });

//     const {metadata, masterEdition} = await getAccounts()

//     const createLotteryAccount = useMutation<string, Error, CreateLotteryArgs>({
//         mutationKey: ["LotteryAccount", "create", { endpoint }],
//         mutationFn: ({ startTime, endTime, price, payer }) =>
//             program.methods
//                 .initializeConfig(
//                     new BN(startTime),
//                     new BN(endTime),
//                     new BN(price)
//                 )
//                 .accounts(
//                     {
//                         payer: new PublicKey(payer),
//                     }
//                 )
//                 .rpc(),
//         onSuccess: (signature) => {
//             transactionToast(signature);
//             return accounts.refetch();
//         },
//         onError: () => toast.error("Failed to initialize account"),
//     });

//     const createLotteryInxAccount = useMutation<string, Error, CreateLotteryArgs>({
//         mutationKey: ["LotteryAccount", "create", { endpoint }],
//         mutationFn: ({ startTime, endTime, price, payer }) => 
           
//             program.methods
//                 .initializeLottery()
//                 .accounts(
//                     {
//                         masterEdition: masterEdition,
//                         metadata: metadata,
//                         tokenProgram: TOKEN_PROGRAM_ID
//                     }
//                 )
//                 .rpc(),
//         onSuccess: (signature) => {
//             transactionToast(signature);
//             return accounts.refetch();
//         },
//         onError: () => toast.error("Failed to initializeLottery account"),
//     });

//     return {
//         program,
//         programId,
//         accounts,
//         getProgramAccount,
//         createLotteryAccount,
//         createLotteryInxAccount
//     };
// }

// // export function useVestingProgramAccount({ account }: { account: PublicKey }) {
// //     // const { cluster } = useCluster();
// //     const transactionToast = useTransactionToast();
// //  //   const { program, accounts } = useLotteryProgram();

// //     const accountQuery = useQuery({
// //         queryKey: ["vesting", "fetch", { endpoint, account }],
// //         queryFn: () => program.account.lotteryToken.fetch(account),
// //     });

// //     // const createEmployeeVesting = useMutation<string, Error, CreateEmployeeArgs>({
// //     //     mutationKey: ["vesting", "close", { endpoint, account }],
// //     //     mutationFn: ({ startTime, endTime, totalAmount, cliffTime }) =>
// //     //         program.methods
// //     //             .createEmployeeVesting(startTime, endTime, totalAmount, cliffTime)
// //     //             .rpc(),
// //     //     onSuccess: (tx) => {
// //     //         transactionToast(tx);
// //     //         return accounts.refetch();
// //     //     },
// //     // });

// //     return {
// //         accountQuery,
// //         //createEmployeeVesting,
// //     };
// // }


function useTransactionToast() {
    return (signature: string) => {
        toast.success(
            <div className={'text-center'}>
                <div className="text-lg">Transaction sent</div>
                <ExplorerLink
                    path={`tx/${signature}`}
                    label={'View Transaction'}
                    className="btn btn-xs btn-primary"
                />
            </div>
        );
    };


}