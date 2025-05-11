"use client"
import React, { useEffect, useState } from "react";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { useLotteryProgram } from "@/lib/setup";





interface CreateLotteryArgs {
  startTime: number;
  endTime: number;
  price: number;
}

const LotteryPage = () => {
  const [winner, setWinner] = useState<string | null>(null);
  const [tx, setTx] = useState('');
  const { connection } = useConnection();
  const wallet = useWallet();
      

console.log(connection.rpcEndpoint)
  const revealWinner = () => {
    setWinner("0xAbC123...EfG456");
  };

  // const claimPrize = () => {
  //   setClaimedAmount(2.5);
  // };

  const lotteryInitializeHandler = async (startTime: number, endTime: number, price: number) => {
      const res = await ((await useLotteryProgram(wallet, connection)).InitializeConfigs({startTime: startTime, endTime: endTime, price: price}))
     
      setTx(res || '')
      console.log(tx)
  }

  return (
    <div className="min-h-screen bg-gray-100 p-6 space-y-6">
      <h1 className="text-3xl font-bold text-center text-indigo-600">Decentralized Lottery DApp</h1>

      {/* Create Ticket Component */}
      <div className="bg-white shadow-md rounded-lg p-6 max-w-xl mx-auto space-y-4">

       { 
        tx ?    <div>
        <h2 className="text-xl font-semibold text-gray-800">Signature</h2>
        <p>{tx}</p>
                </div>
                :
                <div>
        <h2 className="text-xl font-semibold text-gray-800">Create Ticket</h2>
        <input type="datetime-local" className="w-full p-2 border rounded required" />
        <input type="datetime-local" className="w-full p-2 border rounded required" />
        <input type="number" placeholder="Ticket Price in SOl" className="w-full p-2 border rounded required" />
        <br />
        <button className="w-full bg-indigo-600 text-white py-2 rounded hover:bg-indigo-700" onClick={() => lotteryInitializeHandler(1, 4, 7)}>Create Ticket</button>
  
        </div>
         }
             </div>

      {/* Buy Ticket Component */}
      <div className="bg-white shadow-md rounded-lg p-6 max-w-xl mx-auto space-y-4">
        <h2 className="text-xl font-semibold text-gray-800">Buy Ticket</h2>
        <button className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700">Buy Ticket</button>
      </div>

      {/* Reveal Ticket Component */}
      <div className="bg-white shadow-md rounded-lg p-6 max-w-xl mx-auto space-y-4">
        <h2 className="text-xl font-semibold text-gray-800">Reveal Ticket</h2>
        <button onClick={revealWinner} className="w-full bg-yellow-500 text-white py-2 rounded hover:bg-yellow-600">Reveal Winner</button>
        {winner && <p className="text-center text-green-700 font-medium">Winner: {winner}</p>}
      </div>

      {/* Claim Prize Component */}
      {/* <div className="bg-white shadow-md rounded-lg p-6 max-w-xl mx-auto space-y-4">
        <h2 className="text-xl font-semibold text-gray-800">Claim Prize</h2>
        <button onClick={claimPrize} className="w-full bg-purple-600 text-white py-2 rounded hover:bg-purple-700">Claim Prize</button>
        {claimedAmount !== null && <p className="text-center text-green-700 font-medium">You claimed: {claimedAmount} ETH</p>}
      </div> */}
    </div>
  );
};

export default LotteryPage;
