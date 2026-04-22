import React, { useState, useMemo, useRef, useEffect } from 'react';
import { useTrading } from '@/contexts/TradingContext';
import StockCard from './StockCard';
import PageLayout from './PageLayout';
import { Stock } from '@/data/stocks';
import { TrendingUp, TrendingDown, ArrowRight, Zap, Shield, BarChart3, Award, Wifi, X, Check } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Checkbox } from '@/components/ui/checkbox';

const SECTORS = ['All', 'Technology', 'Banking', 'Finance', 'Consumer', 'Healthcare', 'Pharma', 'Energy', 'Auto', 'Retail', 'Entertainment', 'Internet', 'Fintech', 'Telecom'];
const SORTS = [
  { id: 'default', label: 'Default' },
  { id: 'gainers', label: 'Top Gainers' },
  { id: 'losers', label: 'Top Losers' },
  { id: 'price_high', label: 'Price: High to Low' },
  { id: 'price_low', label: 'Price: Low to High' },
];

const FEATURES_DATA = [
  {
    icon: Shield,
    title: 'Bank-grade Security',
    desc: 'AWS Cognito with JWT, IAM roles, and encrypted data at rest',
    details: [
      'Military-grade encryption for all sensitive data',
      'JWT token-based authentication with AWS Cognito',
      'IAM roles and policies for access control',
      'End-to-end encryption for transactions',
      'Regular security audits and penetration testing',
      'GDPR and compliance-ready infrastructure',
    ],
  },
  {
    icon: Zap,
    title: 'Real Market Data',
    desc: 'Live quotes via Twelve Data API Gateway refreshed every minute',
    details: [
      'Real-time stock quotes via Twelve Data API',
      'Updates every minute with live market data',
      'Historical price charts and technical analysis',
      '50+ US stocks with comprehensive data',
      'Multi-exchange support (NYSE, NASDAQ, etc.)',
      'Reliable API Gateway with 99.9% uptime',
    ],
  },
  {
    icon: BarChart3,
    title: 'Advanced Analytics',
    desc: 'Portfolio tracking, P&L reports, and custom watchlists',
    details: [
      'Real-time portfolio performance tracking',
      'Detailed P&L reports and analysis',
      'Custom watchlists for favorite stocks',
      'Technical indicators and chart analysis',
      'Historical transaction reports',
      'Tax-ready statements and documents',
    ],
  },
  {
    icon: Award,
    title: 'Auto-scaling',
    desc: 'ECS Fargate with blue-green deployments on CodePipeline',
    details: [
      'AWS ECS Fargate for containerized deployment',
      'Auto-scaling based on traffic patterns',
      'Blue-green deployments for zero-downtime updates',
      'AWS CodePipeline for CI/CD automation',
      'Load balancing across availability zones',
      'Multi-region failover for high availability',
    ],
  },
];

const AppLayout: React.FC = () => {
  const { stocks, searchQuery, getPortfolioValue, walletBalance, holdings, isLiveData, lastSyncedAt } = useTrading();
  const [selectedSectors, setSelectedSectors] = useState<string[]>(['All']);
  const [sort, setSort] = useState('default');
  const [showSectorFilter, setShowSectorFilter] = useState(false);
  const [activeFeature, setActiveFeature] = useState<number | null>(null);
  const filterRef = useRef<HTMLDivElement>(null);

  // Close filter dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (filterRef.current && !filterRef.current.contains(event.target as Node)) {
        setShowSectorFilter(false);
      }
    };

    if (showSectorFilter) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showSectorFilter]);

  const filtered = useMemo(() => {
    let list = stocks;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter(s => s.symbol.toLowerCase().includes(q) || s.name.toLowerCase().includes(q));
    }
    if (!selectedSectors.includes('All') && selectedSectors.length > 0) {
      list = list.filter(s => selectedSectors.includes(s.sector));
    }
    if (sort === 'gainers') list = [...list].sort((a, b) => b.changePercent - a.changePercent);
    if (sort === 'losers') list = [...list].sort((a, b) => a.changePercent - b.changePercent);
    if (sort === 'price_high') list = [...list].sort((a, b) => b.price - a.price);
    if (sort === 'price_low') list = [...list].sort((a, b) => a.price - b.price);
    return list;
  }, [stocks, searchQuery, selectedSectors, sort]);

  const handleSectorChange = (sectorName: string) => {
    if (sectorName === 'All') {
      setSelectedSectors(['All']);
    } else {
      let newSectors = selectedSectors.filter(s => s !== 'All');
      if (newSectors.includes(sectorName)) {
        newSectors = newSectors.filter(s => s !== sectorName);
      } else {
        newSectors = [...newSectors, sectorName];
      }
      setSelectedSectors(newSectors.length === 0 ? ['All'] : newSectors);
    }
  };

  const topGainers = useMemo(() => [...stocks].sort((a, b) => b.changePercent - a.changePercent), [stocks]);
  const topLosers = useMemo(() => [...stocks].sort((a, b) => a.changePercent - b.changePercent), [stocks]);
  const mostActive = useMemo(() => [...stocks].sort((a, b) => parseFloat(b.volume) - parseFloat(a.volume)), [stocks]);

  const portfolio = getPortfolioValue();

  return (
    <PageLayout>
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-slate-950 to-slate-900 border-b border-slate-800">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-emerald-500/10 via-transparent to-transparent pointer-events-none"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16 relative">
          <div className="grid lg:grid-cols-2 gap-10 items-center">
            <div>
              <div className="inline-flex items-center gap-2 bg-emerald-500/10 text-emerald-400 px-3 py-1 rounded-full text-xs font-medium mb-4">
                <Wifi className="w-3 h-3" />
                {isLiveData ? 'LIVE · Twelve Data Feed' : 'Connecting to market feed...'}
                {lastSyncedAt && <span className="text-emerald-500/70">· {new Date(lastSyncedAt).toLocaleTimeString()}</span>}
              </div>
              <h1 className="text-4xl lg:text-6xl font-bold text-white leading-tight mb-4">
                Trade stocks with <span className="bg-gradient-to-r from-emerald-400 to-emerald-600 bg-clip-text text-transparent">zero risk</span>
              </h1>
              <p className="text-slate-400 text-lg mb-6 max-w-xl">
                Master the stock market with our simulation platform. Practice with virtual money powered by real market data from Twelve Data and AWS cloud-native infrastructure.
              </p>
              <div className="flex flex-wrap gap-3">
                <Link to="/portfolio" className="bg-emerald-500 hover:bg-emerald-600 text-white px-6 py-3 rounded-lg font-semibold flex items-center gap-2 transition-colors">
                  View Portfolio <ArrowRight className="w-4 h-4" />
                </Link>
                <Link to="/wallet" className="bg-slate-800 hover:bg-slate-700 text-white px-6 py-3 rounded-lg font-semibold border border-slate-700 transition-colors">
                  Add Money
                </Link>
              </div>

              <div className="mt-8 grid grid-cols-3 gap-4 max-w-lg">
                <div>
                  <div className="text-2xl font-bold text-white">50+</div>
                  <div className="text-xs text-slate-400">US stocks tracked</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-white">Live</div>
                  <div className="text-xs text-slate-400">Real-time quotes</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-white">24/7</div>
                  <div className="text-xs text-slate-400">AWS Uptime</div>
                </div>
              </div>
            </div>

            {/* Portfolio summary card */}
            <div className="bg-gradient-to-br from-slate-800/80 to-slate-900/80 border border-slate-700 rounded-2xl p-6 backdrop-blur">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-white font-semibold">Your Portfolio</h3>
                <span className="text-xs text-slate-400">{holdings.length} holdings</span>
              </div>
              <div className="text-3xl font-bold text-white mb-1">
                ₹{portfolio.current.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </div>
              <div className={`text-sm flex items-center gap-1 mb-6 ${portfolio.pnl >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                {portfolio.pnl >= 0 ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                {portfolio.pnl >= 0 ? '+' : ''}₹{portfolio.pnl.toFixed(2)} ({portfolio.pnlPercent.toFixed(2)}%)
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-slate-900/50 rounded-lg p-3">
                  <div className="text-xs text-slate-400">Invested</div>
                  <div className="text-white font-semibold">₹{portfolio.invested.toFixed(2)}</div>
                </div>
                <div className="bg-slate-900/50 rounded-lg p-3">
                  <div className="text-xs text-slate-400">Wallet</div>
                  <div className="text-white font-semibold">₹{walletBalance.toLocaleString('en-IN', { maximumFractionDigits: 0 })}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Market Movers */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid md:grid-cols-3 gap-6">
          <MoverList title="Top Gainers" stocks={topGainers} icon={<TrendingUp className="w-4 h-4 text-emerald-400" />} />
          <MoverList title="Top Losers" stocks={topLosers} icon={<TrendingDown className="w-4 h-4 text-red-400" />} />
          <MoverList title="Most Active" stocks={mostActive} icon={<BarChart3 className="w-4 h-4 text-indigo-400" />} />
        </div>
      </section>

      {/* Stocks Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
          <div>
            <h2 className="text-2xl font-bold text-white">Explore Stocks</h2>
            <p className="text-slate-400 text-sm">{filtered.length} stocks available · Live data via Twelve Data</p>
          </div>
          <select value={sort} onChange={e => setSort(e.target.value)}
            className="bg-slate-800 border border-slate-700 text-white text-sm rounded-lg px-3 py-2 focus:outline-none focus:border-emerald-500">
            {SORTS.map(s => <option key={s.id} value={s.id}>{s.label}</option>)}
          </select>
        </div>

        {/* Technology Filter Dropdown */}
        <div className="mb-6 relative" ref={filterRef}>
          <button
            onClick={() => setShowSectorFilter(!showSectorFilter)}
            className="bg-slate-800 border border-slate-700 text-white px-4 py-2.5 rounded-lg flex items-center gap-2 hover:bg-slate-700 transition-colors">
            <span className="text-sm font-medium">Filter by Sector</span>
            <span className="text-xs bg-emerald-500 text-white px-2 py-1 rounded-full">{selectedSectors.includes('All') ? SECTORS.length - 1 : selectedSectors.length}</span>
            <svg className={`w-4 h-4 transition-transform ${showSectorFilter ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
            </svg>
          </button>

          {showSectorFilter && (
            <div className="absolute top-full left-0 mt-2 bg-slate-800 border border-slate-700 rounded-lg shadow-lg z-50 min-w-80 max-h-96 overflow-y-auto">
              <div className="p-4 space-y-3">
                {SECTORS.map(sectorName => (
                  <label key={sectorName} className="flex items-center gap-3 cursor-pointer hover:bg-slate-700 p-2 rounded transition-colors">
                    <Checkbox
                      checked={selectedSectors.includes(sectorName)}
                      onChange={() => handleSectorChange(sectorName)}
                      className="w-4 h-4"
                    />
                    <span className="text-white text-sm flex-1">{sectorName}</span>
                    {selectedSectors.includes(sectorName) && <Check className="w-4 h-4 text-emerald-400" />}
                  </label>
                ))}
              </div>
            </div>
          )}
        </div>

        {filtered.length === 0 ? (
          <div className="text-center py-20 text-slate-400">No stocks match your filters</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filtered.map(stock => <StockCard key={stock.symbol} stock={stock} />)}
          </div>
        )}
      </section>

      {/* Features Strip */}
      <section className="bg-slate-900/50 border-y border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid md:grid-cols-4 gap-6">
            {FEATURES_DATA.map((f, i) => (
              <button
                key={i}
                onClick={() => setActiveFeature(i)}
                className="bg-slate-800/50 border border-slate-700 hover:border-emerald-500/50 rounded-xl p-5 cursor-pointer transition-all duration-200 hover:shadow-lg hover:shadow-emerald-500/5 hover:-translate-y-0.5 text-left group">
                <div className="w-10 h-10 bg-emerald-500/10 rounded-lg flex items-center justify-center mb-3 group-hover:bg-emerald-500/20 transition-colors">
                  <f.icon className="w-5 h-5 text-emerald-400" />
                </div>
                <h3 className="text-white font-semibold mb-1 group-hover:text-emerald-400 transition-colors">{f.title}</h3>
                <p className="text-slate-400 text-sm">{f.desc}</p>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Feature Details Modal */}
      <Dialog open={activeFeature !== null} onOpenChange={(open) => !open && setActiveFeature(null)}>
        <DialogContent className="bg-slate-800 border-slate-700 max-w-2xl">
          <DialogHeader>
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-emerald-500/10 rounded-lg flex items-center justify-center">
                {activeFeature !== null && React.createElement(FEATURES_DATA[activeFeature].icon, { className: "w-6 h-6 text-emerald-400" })}
              </div>
              <div className="flex-1">
                <DialogTitle className="text-white text-xl">
                  {activeFeature !== null && FEATURES_DATA[activeFeature].title}
                </DialogTitle>
                <DialogDescription className="text-slate-400 mt-2">
                  {activeFeature !== null && FEATURES_DATA[activeFeature].desc}
                </DialogDescription>
              </div>
            </div>
          </DialogHeader>
          {activeFeature !== null && (
            <div className="space-y-3 mt-6">
              {FEATURES_DATA[activeFeature].details.map((detail, idx) => (
                <div key={idx} className="flex items-start gap-3">
                  <div className="w-2 h-2 rounded-full bg-emerald-400 mt-2 flex-shrink-0"></div>
                  <p className="text-slate-300">{detail}</p>
                </div>
              ))}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </PageLayout>
  );
};

const MoverList: React.FC<{ title: string; stocks: Stock[]; icon: React.ReactNode }> = ({ title, stocks, icon }) => (
  <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-4">
    <div className="flex items-center gap-2 mb-3">
      {icon}
      <h3 className="text-white font-semibold text-sm">{title}</h3>
    </div>
    <div className="max-h-64 overflow-y-auto scrollbar-thin scrollbar-thumb-slate-600 scrollbar-track-slate-700 space-y-2 pr-2">
      {stocks.map(s => (
        <Link key={s.symbol} to={`/stock/${s.symbol}`} className="flex items-center justify-between py-2 hover:bg-slate-700/50 -mx-2 px-2 rounded transition-colors gap-2">
          <div className="flex items-center gap-2 min-w-0 flex-1">
            {/* Company Logo */}
            <div className="w-8 h-8 rounded-lg bg-slate-700 flex items-center justify-center text-white font-bold text-xs flex-shrink-0 overflow-hidden">
              {s.logo && s.logo !== 'https://logo.clearbit.com/null' ? (
                <img 
                  src={s.logo} 
                  alt={s.symbol}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).style.display = 'none';
                    (e.target as HTMLImageElement).nextElementSibling?.classList.remove('hidden');
                  }}
                />
              ) : null}
              <span className="hidden text-xs font-bold">{s.symbol.charAt(0)}</span>
            </div>
            <div className="min-w-0 flex-1">
              <div className="text-white text-sm font-medium truncate">{s.symbol}</div>
              <div className="text-slate-400 text-xs truncate">{s.name}</div>
            </div>
          </div>
          <div className="text-right flex-shrink-0">
            <div className="text-white text-sm">₹{s.price.toFixed(2)}</div>
            <div className={`text-xs ${s.changePercent >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
              {s.changePercent >= 0 ? '+' : ''}{s.changePercent.toFixed(2)}%
            </div>
          </div>
        </Link>
      ))}
    </div>
  </div>
);

export default AppLayout;
