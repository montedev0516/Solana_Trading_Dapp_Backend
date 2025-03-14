import { Connection, PublicKey } from '@solana/web3.js';

export const connection = new Connection(process.env.HTTP_RPC_URL || '');

export const SOL_PUBLIC_KEY = new PublicKey('So11111111111111111111111111111111111111112');
