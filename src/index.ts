import dotenv from 'dotenv';
dotenv.config({
  path: './.env',
});
import express from 'express';
import cors from 'cors';
import { ApolloServer, gql } from 'apollo-server-express';
import { fetchToken, fetchTokens } from './lib/fetch-tokens';
import { trade, tradeHistory } from './lib/trade';

export const typeDefs = gql`
  type Todo {
    id: Int!
    title: String
  }
  type Token {
    address: String
    name: String
    symbol: String
    logoURI: String
    decimals: Int
    price: Float
    lastTradeUnixTime: Float
    liquidity: Float
    mc: Float
    v24hChangePercent: Float
    v24hUSD: Float
  }
  type Transaction {
    txHash: String
    blockNumber: Int
    blockTime: String
    status: Boolean
    from: String
    to: String
    fee: Int
    mainAction: String
    solAmount: Float
    tokenAmount: Float
    tokenDecimals: Int
  }
  type Query {
    hello: String
    tokens(address: String, name: String, symbol: String): [Token]
    token(address: String): Token
    trade(type: String, address: String, publicKey: String, slippage: Float, amount: Float): String
    trade_history(address: String): [Transaction]
  }
`;

const resolvers = {
  Query: {
    hello: () => 'Hello, world',
    tokens: async (_: any, { address, name, symbol }: { address: string; name: string; symbol: string }) => {
      console.log('tokens:', address, name, symbol);
      return await fetchTokens(address, name, symbol);
    },
    token: async (_: any, { address }: { address: string }) => {
      console.log('token:', address);
      return await fetchToken(address);
    },
    trade: async (_: any, { type, address, publicKey, slippage, amount }: { type: string; address: string; publicKey: string; slippage: number; amount: number }) => {
      console.log('trade:', type, address, slippage, amount);
      return await trade(type, address, publicKey, amount, slippage);
    },
    trade_history: async (_: any, { address }: { address: string }) => {
      console.log('trade_history:', address);
      return tradeHistory(address);
    },
  },
};

const server = new ApolloServer({ typeDefs, resolvers });

const app = express();
app.use(cors({ origin: '*' }));

const startServer = async () => {
  await server.start();
  server.applyMiddleware({ app });

  app.listen({ port: 4000 }, () => {
    console.log(`🚀 Server ready at http://localhost:4000${server.graphqlPath}`);
  });
};

startServer().catch((error) => {
  console.error(error);
});
