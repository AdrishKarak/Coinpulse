import React from 'react';
import { fetcher } from '@/lib/coingecko.actions';
import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import { formatCurrency } from '@/lib/utils';

const Page = async ({ params }: NextPageProps) => {
  const { id } = params;

  const [coinData, coinOHLCData] = await Promise.all([
    fetcher<CoinDetailsData>(`/coins/${id}`),
    fetcher<OHLCData>(`/coins/${id}/ohlc`, {
      vs_currency: 'usd',
      days: 1,
    }),
  ]);

  if (!coinData || !coinOHLCData) {
    return (
      <main>
        <h2>Failed to load coin data.</h2>
        <p>Please try again in a few seconds.</p>
      </main>
    );
  }

  const coinDetails = [
    {
      label: 'Market Cap',
      value: formatCurrency(coinData.market_data?.market_cap?.usd),
    },
    {
      label: 'Market Cap Rank',
      value: `# ${coinData.market_cap_rank ?? '-'}`,
    },
    {
      label: 'Total Volume',
      value: formatCurrency(coinData.market_data?.total_volume?.usd),
    },
    {
      label: 'Website',
      value: '-',
      link: coinData.links?.homepage?.[0],
      linkText: 'Homepage',
    },
    {
      label: 'Explorer',
      value: '-',
      link: coinData.links?.blockchain_site?.[0],
      linkText: 'Explorer',
    },
  ];

  return (
    <main id="coin-details-page">
      <section className="primary">
        <h1>{coinData.name}</h1>
        <p>
          Current Price:{' '}
          {formatCurrency(coinData.market_data?.current_price?.usd)}
        </p>
      </section>

      <section className="secondary">
        <div className="details">
          <h4>Coin Details</h4>

          <ul className="details-grid">
            {coinDetails.map(({ label, value, link, linkText }, index) => (
              <li key={index}>
                <p>{label}</p>

                {link ? (
                  <div className="link">
                    <Link href={link} target="_blank">
                      {linkText || label}
                    </Link>
                    <ArrowUpRight size={16} />
                  </div>
                ) : (
                  <p>{value}</p>
                )}
              </li>
            ))}
          </ul>
        </div>
      </section>
    </main>
  );
};

export default Page;
