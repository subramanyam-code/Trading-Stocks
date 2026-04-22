import React, { useState, useMemo } from 'react';
import PageLayout from '@/components/PageLayout';
import { TrendingUp, TrendingDown, ArrowRight, TrendingUp as TrendingUpIcon } from 'lucide-react';
import { Link } from 'react-router-dom';

interface MutualFund {
  symbol: string;
  name: string;
  category: string;
  nav: number;
  change: number;
  changePercent: number;
  returns1Y: number;
  returns3Y: number;
  expense: number;
  minInvestment: number;
  assetUnderManagement: string;
  logo: string;
}

const SAMPLE_FUNDS: MutualFund[] = [
  {
    symbol: 'TATSILV',
    name: 'Tata Silver ETF',
    category: 'Commodity',
    nav: 485.25,
    change: 2.40,
    changePercent: 0.50,
    returns1Y: 8.5,
    returns3Y: 12.3,
    expense: 0.10,
    minInvestment: 100,
    assetUnderManagement: '1,250 Cr',
    logo: 'https://logo.clearbit.com/tatamutualfund.com',
  },
  {
    symbol: 'TATAGOLD',
    name: 'Tata Gold ETF',
    category: 'Commodity',
    nav: 580.40,
    change: 3.75,
    changePercent: 0.65,
    returns1Y: 6.2,
    returns3Y: 9.8,
    expense: 0.10,
    minInvestment: 100,
    assetUnderManagement: '2,840 Cr',
    logo: 'https://logo.clearbit.com/tatamutualfund.com',
  },
  {
    symbol: 'ABSLARGE',
    name: 'Aditya Birla Large Cap Fund',
    category: 'Large Cap',
    nav: 324.55,
    change: 2.18,
    changePercent: 0.68,
    returns1Y: 15.4,
    returns3Y: 18.2,
    expense: 0.65,
    minInvestment: 500,
    assetUnderManagement: '8,560 Cr',
    logo: 'https://logo.clearbit.com/adityabirlasun.com',
  },
  {
    symbol: 'ICICIBALANCE',
    name: 'ICICI Prudential Balanced Advantage',
    category: 'Balanced',
    nav: 452.30,
    change: 1.85,
    changePercent: 0.41,
    returns1Y: 11.2,
    returns3Y: 13.5,
    expense: 0.56,
    minInvestment: 1000,
    assetUnderManagement: '12,300 Cr',
    logo: 'https://logo.clearbit.com/iciciprulife.com',
  },
  {
    symbol: 'AXISGROWTH',
    name: 'Axis Growth Opportunities Fund',
    category: 'Mid Cap',
    nav: 298.75,
    change: -1.45,
    changePercent: -0.48,
    returns1Y: 18.7,
    returns3Y: 21.4,
    expense: 0.73,
    minInvestment: 500,
    assetUnderManagement: '5,420 Cr',
    logo: 'https://logo.clearbit.com/axismutual.com',
  },
  {
    symbol: 'MIDRISKBNK',
    name: 'MIRAE Mid Risk Balanced Fund',
    category: 'Balanced',
    nav: 156.80,
    change: 0.95,
    changePercent: 0.61,
    returns1Y: 9.5,
    returns3Y: 11.2,
    expense: 0.45,
    minInvestment: 1000,
    assetUnderManagement: '3,150 Cr',
    logo: 'https://logo.clearbit.com/miraeasset.com',
  },
];

const CATEGORIES = ['All', 'Large Cap', 'Mid Cap', 'Small Cap', 'Balanced', 'Commodity'];

const MutualFunds: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState('All');

  const filtered = useMemo(() => {
    if (selectedCategory === 'All') return SAMPLE_FUNDS;
    return SAMPLE_FUNDS.filter(f => f.category === selectedCategory);
  }, [selectedCategory]);

  return (
    <PageLayout>
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-slate-950 to-slate-900 border-b border-slate-800">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-purple-500/10 via-transparent to-transparent pointer-events-none"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 relative">
          <div className="flex items-center justify-between mb-8">
            <Link to="/" className="text-slate-400 hover:text-white flex items-center gap-2">
              <ArrowRight className="w-4 h-4 rotate-180" />
              Back to Stocks
            </Link>
          </div>

          <h1 className="text-4xl lg:text-5xl font-bold text-white leading-tight mb-4">
            Mutual Funds <span className="bg-gradient-to-r from-purple-400 to-purple-600 bg-clip-text text-transparent">Investment</span>
          </h1>
          <p className="text-slate-400 text-lg max-w-2xl">
            Invest in diversified mutual funds with professional fund management. Access a wide range of funds across different categories and risk profiles.
          </p>

          <div className="mt-8 grid grid-cols-3 gap-4 max-w-lg">
            <div className="bg-slate-800/50 rounded-lg p-4 border border-slate-700">
              <div className="text-2xl font-bold text-white">{SAMPLE_FUNDS.length}+</div>
              <div className="text-xs text-slate-400">Funds available</div>
            </div>
            <div className="bg-slate-800/50 rounded-lg p-4 border border-slate-700">
              <div className="text-2xl font-bold text-white">₹100</div>
              <div className="text-xs text-slate-400">Minimum investment</div>
            </div>
            <div className="bg-slate-800/50 rounded-lg p-4 border border-slate-700">
              <div className="text-2xl font-bold text-white">Low Cost</div>
              <div className="text-xs text-slate-400">Expense ratios</div>
            </div>
          </div>
        </div>
      </section>

      {/* Funds Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
          <div>
            <h2 className="text-2xl font-bold text-white">Explore Funds</h2>
            <p className="text-slate-400 text-sm">{filtered.length} funds available</p>
          </div>
        </div>

        {/* Category Filter */}
        <div className="mb-6 flex gap-2 flex-wrap overflow-x-auto pb-2">
          {CATEGORIES.map(category => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
                selectedCategory === category
                  ? 'bg-purple-500 text-white'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}>
              {category}
            </button>
          ))}
        </div>

        {/* Funds Grid */}
        {filtered.length === 0 ? (
          <div className="text-center py-20 text-slate-400">No funds match your filters</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filtered.map(fund => (
              <div
                key={fund.symbol}
                className="bg-slate-800/60 hover:bg-slate-800 border border-slate-700 hover:border-purple-500/50 rounded-xl p-5 cursor-pointer transition-all duration-200 hover:shadow-lg hover:shadow-purple-500/5 group">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-start gap-3 flex-1">
                    <div className="w-10 h-10 rounded-lg bg-slate-700 flex items-center justify-center text-white font-bold text-sm flex-shrink-0 overflow-hidden">
                      {fund.logo && fund.logo !== 'https://logo.clearbit.com/null' ? (
                        <img
                          src={fund.logo}
                          alt={fund.symbol}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            (e.target as HTMLImageElement).style.display = 'none';
                            (e.target as HTMLImageElement).nextElementSibling?.classList.remove('hidden');
                          }}
                        />
                      ) : null}
                      <span className="hidden">{fund.symbol.charAt(0)}</span>
                    </div>
                    <div>
                      <h3 className="text-white font-bold">{fund.symbol}</h3>
                      <p className="text-slate-400 text-sm">{fund.name}</p>
                      <span className="inline-block text-xs bg-purple-500/20 text-purple-300 px-2 py-1 rounded mt-1">
                        {fund.category}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-4 py-4 border-y border-slate-700">
                  <div>
                    <div className="text-xs text-slate-400 mb-1">NAV</div>
                    <div className="text-white font-bold text-lg">₹{fund.nav.toFixed(2)}</div>
                    <div className={`text-xs font-medium flex items-center gap-1 mt-1 ${
                      fund.change >= 0 ? 'text-emerald-400' : 'text-red-400'
                    }`}>
                      {fund.change >= 0 ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                      {fund.change >= 0 ? '+' : ''}{fund.change.toFixed(2)} ({fund.changePercent.toFixed(2)}%)
                    </div>
                  </div>
                  <div>
                    <div className="text-xs text-slate-400 mb-1">1Y Return</div>
                    <div className={`text-white font-bold text-lg ${fund.returns1Y >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                      {fund.returns1Y.toFixed(1)}%
                    </div>
                    <div className="text-xs text-slate-400 mt-1">3Y: {fund.returns3Y.toFixed(1)}%</div>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-2 text-sm">
                  <div>
                    <div className="text-xs text-slate-400">Expense</div>
                    <div className="text-white font-medium">{fund.expense.toFixed(2)}%</div>
                  </div>
                  <div>
                    <div className="text-xs text-slate-400">Min</div>
                    <div className="text-white font-medium">₹{fund.minInvestment}</div>
                  </div>
                  <div>
                    <div className="text-xs text-slate-400">AUM</div>
                    <div className="text-white font-medium">{fund.assetUnderManagement}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Benefits Section */}
      <section className="bg-slate-900/50 border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <h2 className="text-2xl font-bold text-white mb-8">Why Invest in Mutual Funds?</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6">
              <div className="w-10 h-10 bg-purple-500/10 rounded-lg flex items-center justify-center mb-3">
                <TrendingUpIcon className="w-5 h-5 text-purple-400" />
              </div>
              <h3 className="text-white font-semibold text-lg mb-3">Professional Management</h3>
              <p className="text-slate-400 text-sm">
                Expert fund managers who analyze markets and make investment decisions to maximize returns.
              </p>
            </div>
            <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6">
              <div className="w-10 h-10 bg-purple-500/10 rounded-lg flex items-center justify-center mb-3">
                <TrendingUpIcon className="w-5 h-5 text-purple-400" />
              </div>
              <h3 className="text-white font-semibold text-lg mb-3">Diversification</h3>
              <p className="text-slate-400 text-sm">
                Spread your investment across multiple securities to reduce risk and improve returns.
              </p>
            </div>
            <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6">
              <div className="w-10 h-10 bg-purple-500/10 rounded-lg flex items-center justify-center mb-3">
                <TrendingUpIcon className="w-5 h-5 text-purple-400" />
              </div>
              <h3 className="text-white font-semibold text-lg mb-3">Low Cost Entry</h3>
              <p className="text-slate-400 text-sm">
                Start investing with as low as ₹100, making it accessible to all investors.
              </p>
            </div>
          </div>
        </div>
      </section>
    </PageLayout>
  );
};

export default MutualFunds;
