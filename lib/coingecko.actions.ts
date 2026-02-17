'use server';

import qs from 'query-string';

const BASE_URL = process.env.COINGECKO_BASE_URL;

if (!BASE_URL) {
  throw new Error('Could not get base url');
}

export async function fetcher<T>(
  endpoint: string,
  params?: QueryParams,
  revalidate = 60,
): Promise<T | null> {
  const url = qs.stringifyUrl(
    {
      url: `${BASE_URL}${endpoint.startsWith('/') ? '' : '/'}${endpoint}`,
      query: params,
    },
    { skipEmptyString: true, skipNull: true },
  );

  try {
    const response = await fetch(url, {
      next: { revalidate },
    });

    if (!response.ok) {
      console.error('CoinGecko Error:', response.status, response.statusText);
      return null;
    }

    return response.json();
  } catch (error) {
    console.error('Fetch crashed:', error);
    return null;
  }
}

export async function getPools(
  id: string,
  network?: string | null,
  contractAddress?: string | null,
): Promise<PoolData> {
  const fallback: PoolData = {
    id: '',
    address: '',
    name: '',
    network: '',
  };

  if (network && contractAddress) {
    const poolData = await fetcher<{ data: PoolData[] }>(
      `/onchain/networks/${network}/tokens/${contractAddress}/pools`,
    );

    return poolData?.data?.[0] ?? fallback;
  }

  const poolData = await fetcher<{ data: PoolData[] }>(
    `/onchain/search/pools`,
    { query: id },
  );

  return poolData?.data?.[0] ?? fallback;
}
