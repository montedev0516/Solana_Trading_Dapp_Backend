import { PublicKey, TransactionSignature } from '@solana/web3.js';
import { connection, SOL_PUBLIC_KEY } from '../config/config';
import { createJupiterSwapTransaction } from './jupiter';
import { transactionsMockData } from '../mock_data/mock-data';

export async function trade(type: string, address: string, publicKey: string, amount: number, slippage: number) {
  try {
    const [mintIn, mintOut] = type === 'Buy' ? [SOL_PUBLIC_KEY, new PublicKey(address)] : [new PublicKey(address), SOL_PUBLIC_KEY];
    const transaction = await createJupiterSwapTransaction(mintIn, mintOut, new PublicKey(publicKey), amount, slippage);

    return transaction;
  } catch (error: any) {
    console.error(error);
    throw new Error(error.message || 'Unexpected error while trading');
  }
}

export async function tradeHistory(address: string) {
  try {
    const signatures = await connection.getSignaturesForAddress(new PublicKey(address), { limit: 10 }, 'confirmed');
    // const transactions = await connection.getParsedTransactions(signatures)

    return transactionsMockData;
  } catch (error) {
    console.error(error);
  }
}
