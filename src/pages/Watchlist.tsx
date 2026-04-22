import React from 'react';
import { Link } from 'react-router-dom';
import { BookmarkCheck, ArrowRight } from 'lucide-react';
import PageLayout from '@/components/PageLayout';
import StockCard from '@/components/StockCard';
import { useTrading } from '@/contexts/TradingContext';

const Watchlist: React.FC = () => {
  const { watchlist, stocks } = useTrading();
  const watched = stocks.filter(s => watchlist.includes(s.symbol));

  return (
    <PageLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center gap-3 mb-2">
          <BookmarkCheck className="w-7 h-7 text-yellow-400" />
          <h1 className="text-3xl font-bold text-white">Watchlist</h1>
        </div>
        <p className="text-slate-400 text-sm mb-8">{watched.length} stocks you're tracking</p>

        {watched.length === 0 ? (
          <div className="bg-slate-800/60 border border-slate-700 rounded-xl p-12 text-center">
            <BookmarkCheck className="w-12 h-12 text-slate-500 mx-auto mb-4" />
            <h3 className="text-white font-semibold mb-2">Your watchlist is empty</h3>
            <p className="text-slate-400 text-sm mb-6">Add stocks to your watchlist to track them here</p>
            <Link to="/" className="inline-flex items-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-white px-5 py-2.5 rounded-lg font-medium">
              Explore Stocks <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {watched.map(s => <StockCard key={s.symbol} stock={s} />)}
          </div>
        )}
      </div>
    </PageLayout>
  );
};

export default Watchlist;
