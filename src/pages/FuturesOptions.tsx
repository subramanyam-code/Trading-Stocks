import React, { useState, useMemo } from 'react';
import PageLayout from '@/components/PageLayout';
import { TrendingUp, TrendingDown, ArrowRight, Filter } from 'lucide-react';
import { Link } from 'react-router-dom';

interface FutureContract {
  symbol: string;
  underlying: string;
  expiryDate: string;
  strikePrice: number;
  currentPrice: number;
  change: number;
  changePercent: number;
  openInterest: string;
  volume: string;
  contractType: 'Futures' | 'Call Option' | 'Put Option';
}

const SAMPLE_CONTRACTS: FutureContract[] = [
  {
    symbol: 'NIFTY-DEC24-FUT',
    underlying: 'NIFTY 50',
    expiryDate: '2024-12-26',
    strikePrice: 0,
    currentPrice: 24565.75,
    change: 200.90,
    changePercent: 0.82,
    openInterest: '2.4M',
    volume: '890K',
    contractType: 'Futures',
  },
  {
    symbol: 'NIFTY-DEC24-24600-CE',
    underlying: 'NIFTY 50',
    expiryDate: '2024-12-26',
    strikePrice: 24600,
    currentPrice: 185.50,
    change: 12.40,
    changePercent: 7.17,
    openInterest: '1.2M',
    volume: '245K',
    contractType: 'Call Option',
  },
  {
    symbol: 'NIFTY-DEC24-24500-PE',
    underlying: 'NIFTY 50',
    expiryDate: '2024-12-26',
    strikePrice: 24500,
    currentPrice: 120.25,
    change: -5.80,
    changePercent: -4.60,
    openInterest: '890K',
    volume: '178K',
    contractType: 'Put Option',
  },
  {
    symbol: 'AAPL-JAN25-FUT',
    underlying: 'Apple Inc.',
    expiryDate: '2025-01-17',
    strikePrice: 0,
    currentPrice: 273.05,
    change: 2.82,
    changePercent: 1.04,
    openInterest: '450K',
    volume: '125K',
    contractType: 'Futures',
  },
  {
    symbol: 'AAPL-JAN25-275-CE',
    underlying: 'Apple Inc.',
    expiryDate: '2025-01-17',
    strikePrice: 275,
    currentPrice: 12.85,
    change: 0.95,
    changePercent: 8.04,
    openInterest: '320K',
    volume: '85K',
    contractType: 'Call Option',
  },
  {
    symbol: 'MSFT-JAN25-FUT',
    underlying: 'Microsoft Corp.',
    expiryDate: '2025-01-17',
    strikePrice: 0,
    currentPrice: 418.07,
    change: -4.72,
    changePercent: -1.12,
    openInterest: '380K',
    volume: '98K',
    contractType: 'Futures',
  },
];

const FuturesOptions: React.FC = () => {
  const [selectedType, setSelectedType] = useState<'All' | 'Futures' | 'Call Option' | 'Put Option'>('All');

  const filtered = useMemo(() => {
    if (selectedType === 'All') return SAMPLE_CONTRACTS;
    return SAMPLE_CONTRACTS.filter(c => c.contractType === selectedType);
  }, [selectedType]);

  return (
    <PageLayout>
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-slate-950 to-slate-900 border-b border-slate-800">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-blue-500/10 via-transparent to-transparent pointer-events-none"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 relative">
          <div className="flex items-center justify-between mb-8">
            <Link to="/" className="text-slate-400 hover:text-white flex items-center gap-2">
              <ArrowRight className="w-4 h-4 rotate-180" />
              Back to Stocks
            </Link>
          </div>

          <h1 className="text-4xl lg:text-5xl font-bold text-white leading-tight mb-4">
            Futures & Options <span className="bg-gradient-to-r from-blue-400 to-blue-600 bg-clip-text text-transparent">Trading</span>
          </h1>
          <p className="text-slate-400 text-lg max-w-2xl">
            Trade derivatives with leverage and hedging capabilities. Access futures contracts and options with real-time pricing and advanced tools.
          </p>

          <div className="mt-8 grid grid-cols-3 gap-4 max-w-lg">
            <div className="bg-slate-800/50 rounded-lg p-4 border border-slate-700">
              <div className="text-2xl font-bold text-white">100+</div>
              <div className="text-xs text-slate-400">Contracts available</div>
            </div>
            <div className="bg-slate-800/50 rounded-lg p-4 border border-slate-700">
              <div className="text-2xl font-bold text-white">24/7</div>
              <div className="text-xs text-slate-400">Trading hours</div>
            </div>
            <div className="bg-slate-800/50 rounded-lg p-4 border border-slate-700">
              <div className="text-2xl font-bold text-white">Up to 10x</div>
              <div className="text-xs text-slate-400">Leverage available</div>
            </div>
          </div>
        </div>
      </section>

      {/* Contracts Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
          <div>
            <h2 className="text-2xl font-bold text-white">Active Contracts</h2>
            <p className="text-slate-400 text-sm">{filtered.length} contracts available</p>
          </div>
        </div>

        {/* Filter */}
        <div className="mb-6 flex gap-2 flex-wrap">
          {(['All', 'Futures', 'Call Option', 'Put Option'] as const).map(type => (
            <button
              key={type}
              onClick={() => setSelectedType(type)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                selectedType === type
                  ? 'bg-blue-500 text-white'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}>
              {type}
            </button>
          ))}
        </div>

        {/* Contracts Grid */}
        {filtered.length === 0 ? (
          <div className="text-center py-20 text-slate-400">No contracts match your filters</div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {filtered.map(contract => (
              <div
                key={contract.symbol}
                className="bg-slate-800/60 hover:bg-slate-800 border border-slate-700 hover:border-blue-500/50 rounded-xl p-4 cursor-pointer transition-all duration-200 hover:shadow-lg hover:shadow-blue-500/5">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-white font-bold text-lg">{contract.symbol}</h3>
                    <p className="text-slate-400 text-sm">{contract.underlying}</p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                    contract.contractType === 'Futures'
                      ? 'bg-indigo-500/20 text-indigo-300'
                      : contract.contractType === 'Call Option'
                      ? 'bg-emerald-500/20 text-emerald-300'
                      : 'bg-red-500/20 text-red-300'
                  }`}>
                    {contract.contractType}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <div className="text-xs text-slate-400 mb-1">Current Price</div>
                    <div className="text-white font-bold text-lg">₹{contract.currentPrice.toFixed(2)}</div>
                  </div>
                  <div>
                    <div className="text-xs text-slate-400 mb-1">Change</div>
                    <div className={`text-sm font-semibold flex items-center gap-1 ${
                      contract.change >= 0 ? 'text-emerald-400' : 'text-red-400'
                    }`}>
                      {contract.change >= 0 ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                      {contract.change >= 0 ? '+' : ''}{contract.change.toFixed(2)} ({contract.changePercent.toFixed(2)}%)
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-2 pt-4 border-t border-slate-700">
                  <div>
                    <div className="text-xs text-slate-400">Expiry</div>
                    <div className="text-white text-sm font-medium">{new Date(contract.expiryDate).toLocaleDateString()}</div>
                  </div>
                  {contract.strikePrice > 0 && (
                    <div>
                      <div className="text-xs text-slate-400">Strike</div>
                      <div className="text-white text-sm font-medium">₹{contract.strikePrice}</div>
                    </div>
                  )}
                  <div>
                    <div className="text-xs text-slate-400">Volume</div>
                    <div className="text-white text-sm font-medium">{contract.volume}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Education Section */}
      <section className="bg-slate-900/50 border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <h2 className="text-2xl font-bold text-white mb-8">Learn F&O Trading</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6">
              <h3 className="text-white font-semibold text-lg mb-3">What are Futures?</h3>
              <p className="text-slate-400 text-sm">
                Futures are derivative contracts where two parties agree to buy/sell an asset at a predetermined price on a specified date. They provide leverage and are used for hedging and speculation.
              </p>
            </div>
            <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6">
              <h3 className="text-white font-semibold text-lg mb-3">What are Options?</h3>
              <p className="text-slate-400 text-sm">
                Options give the holder the right, but not obligation, to buy (call) or sell (put) an asset at a strike price. They offer more flexibility with limited downside risk.
              </p>
            </div>
          </div>
        </div>
      </section>
    </PageLayout>
  );
};

export default FuturesOptions;
