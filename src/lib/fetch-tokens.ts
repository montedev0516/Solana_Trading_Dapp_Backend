import { tokenMockData } from '../mock_data/mock-data';

const headers = {
  'Content-Type': 'application/json',
  'x-chain': 'solana',
  'x-api-key': process.env.BIRD_EYE_API_KEY || '',
};

export async function fetchTokens(address?: string, name?: string, symbol?: string) {
  try {
    // const tokenResponse = await fetch('https://api.dexscreener.com/token-profiles/latest/v1', {
    const tokensResponse = await fetch('https://public-api.birdeye.so/defi/tokenlist?limit=50', { headers });

    const tokensProfiles = await tokensResponse.json();
    console.log(address, name, symbol);
    console.log(!address && !name && !symbol);

    return tokensProfiles.data.tokens.filter((token: any) => {
      return (
        (!address || (address && token.address.toLowerCase() === address.toLowerCase())) &&
        (!name || (name && token.name.toLowerCase().includes(name.toLowerCase()))) &&
        (!symbol || (symbol && token.symbol.toLowerCase() === symbol.toLowerCase()))
      );
    });
  } catch (error) {
    console.error(error);
  }
}

export async function fetchToken(address: string) {
  try {
    const tokenResponse = await fetch(`https://public-api.birdeye.so/defi/token_overview?address=${address}`, { headers });
    const tokenProfile = await tokenResponse.json();

    console.log('tokenProfile', tokenProfile);

    const data = {
      address: tokenProfile.address,
      name: tokenProfile.name,
      symbol: tokenProfile.symbol,
      decimals: tokenProfile.decimals,
      logoURI: tokenProfile.logoURI,
      price: tokenProfile.price,
      lastTradeUnixTime: tokenProfile.lastTradeUnixTime,
      liquidity: tokenProfile.liquidity,
      mc: tokenProfile.marketCap,
      v24hChangePercent: tokenProfile.v24hChangePercent,
      v24hUSD: tokenProfile.v24hUSD,
    };

    return data.address ? data : tokenMockData;
  } catch (error) {
    console.error(error);
  }
}
