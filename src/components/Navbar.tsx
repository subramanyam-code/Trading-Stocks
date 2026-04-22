import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Search, Bell, User, TrendingUp, Menu, X, LogOut, Wallet as WalletIcon, FileText, Briefcase, BookmarkCheck, Receipt, Zap, TrendingDown } from 'lucide-react';
import { useTrading } from '@/contexts/TradingContext';
import LoginModal from './LoginModal';

const Navbar: React.FC = () => {
  const { searchQuery, setSearchQuery, profile, walletBalance, logout, stocks } = useTrading();
  const [menuOpen, setMenuOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [loginOpen, setLoginOpen] = useState(false);
  const [searchFocused, setSearchFocused] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const searchResults = searchQuery.trim()
    ? stocks.filter(s =>
        s.symbol.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.name.toLowerCase().includes(searchQuery.toLowerCase())
      ).slice(0, 6)
    : [];

  const navLinks = [
    { to: '/', label: 'Explore', icon: TrendingUp },
    { to: '/portfolio', label: 'Portfolio', icon: Briefcase },
    { to: '/watchlist', label: 'Watchlist', icon: BookmarkCheck },
    { to: '/profile', label: 'Profile', icon: User },
    { to: '/orders', label: 'Orders', icon: Receipt },
    { to: '/futures-options', label: 'F&O', icon: Zap },
    { to: '/mutual-funds', label: 'Mutual Funds', icon: TrendingDown },
  ];

  return (
    <>
      <nav className="sticky top-0 z-40 bg-slate-900/95 backdrop-blur-lg border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-2 lg:gap-8">
              <Link to="/" className="flex items-center gap-2">
                <div className="bg-gradient-to-br from-emerald-400 to-emerald-600 p-2 rounded-lg">
                  <TrendingUp className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-bold text-white hidden sm:block">StockTrade</span>
              </Link>

              <div className="hidden lg:flex items-center gap-1">
                {navLinks.map(link => (
                  <Link
                    key={link.to}
                    to={link.to}
                    className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                      location.pathname === link.to
                        ? 'text-emerald-400 bg-emerald-500/10'
                        : 'text-slate-300 hover:text-white hover:bg-slate-800'
                    }`}
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
            </div>

            <div className="flex-1 max-w-md mx-4 relative">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search stocks..."
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  onFocus={() => setSearchFocused(true)}
                  onBlur={() => setTimeout(() => setSearchFocused(false), 200)}
                  className="w-full bg-slate-800 border border-slate-700 text-white text-sm rounded-lg pl-9 pr-3 py-2 focus:outline-none focus:border-emerald-500"
                />
              </div>
              {searchFocused && searchResults.length > 0 && (
                <div className="absolute top-full mt-2 w-full bg-slate-800 border border-slate-700 rounded-lg shadow-xl overflow-hidden z-50">
                  {searchResults.map(stock => (
                    <button
                      key={stock.symbol}
                      onClick={() => { navigate(`/stock/${stock.symbol}`); setSearchQuery(''); }}
                      className="w-full px-4 py-3 flex items-center justify-between hover:bg-slate-700 transition-colors text-left"
                    >
                      <div>
                        <div className="text-white font-medium text-sm">{stock.symbol}</div>
                        <div className="text-slate-400 text-xs">{stock.name}</div>
                      </div>
                      <div className="text-right">
                        <div className="text-white text-sm font-medium">₹{stock.price.toFixed(2)}</div>
                        <div className={`text-xs ${stock.changePercent >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                          {stock.changePercent >= 0 ? '+' : ''}{stock.changePercent.toFixed(2)}%
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => navigate('/wallet')}
                className="hidden md:flex items-center gap-2 bg-slate-800 hover:bg-slate-700 px-3 py-2 rounded-lg transition-colors"
              >
                <WalletIcon className="w-4 h-4 text-emerald-400" />
                <span className="text-white text-sm font-medium">₹{walletBalance.toLocaleString('en-IN', { maximumFractionDigits: 0 })}</span>
              </button>

              <button className="p-2 text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg transition-colors hidden sm:block">
                <Bell className="w-5 h-5" />
              </button>

              {profile.isAuthenticated ? (
                <div className="relative">
                  <button
                    onClick={() => setProfileOpen(!profileOpen)}
                    className="flex items-center gap-2 bg-gradient-to-br from-indigo-500 to-purple-600 w-9 h-9 rounded-full justify-center text-white font-semibold text-sm"
                  >
                    {profile.name.charAt(0).toUpperCase()}
                  </button>
                  {profileOpen && (
                    <div className="absolute right-0 mt-2 w-64 bg-slate-800 border border-slate-700 rounded-lg shadow-xl overflow-hidden">
                      <div className="p-4 border-b border-slate-700">
                        <div className="text-white font-semibold">{profile.name}</div>
                        <div className="text-slate-400 text-xs">{profile.email}</div>
                      </div>
                      <div className="py-2">
                        <button onClick={() => { navigate('/profile'); setProfileOpen(false); }} className="w-full px-4 py-2 text-left text-slate-300 hover:bg-slate-700 flex items-center gap-2 text-sm">
                          <User className="w-4 h-4" /> Profile
                        </button>
                        <button onClick={() => { navigate('/reports'); setProfileOpen(false); }} className="w-full px-4 py-2 text-left text-slate-300 hover:bg-slate-700 flex items-center gap-2 text-sm">
                          <FileText className="w-4 h-4" /> Reports
                        </button>
                        <button onClick={() => { logout(); setProfileOpen(false); }} className="w-full px-4 py-2 text-left text-red-400 hover:bg-slate-700 flex items-center gap-2 text-sm">
                          <LogOut className="w-4 h-4" /> Logout
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <button
                  onClick={() => setLoginOpen(true)}
                  className="bg-emerald-500 hover:bg-emerald-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                >
                  Sign In
                </button>
              )}

              <button
                onClick={() => setMenuOpen(!menuOpen)}
                className="lg:hidden p-2 text-slate-300 hover:text-white"
              >
                {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>

          {menuOpen && (
            <div className="lg:hidden py-3 border-t border-slate-800 space-y-1">
              {navLinks.map(link => (
                <Link
                  key={link.to}
                  to={link.to}
                  onClick={() => setMenuOpen(false)}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm ${
                    location.pathname === link.to ? 'text-emerald-400 bg-emerald-500/10' : 'text-slate-300 hover:bg-slate-800'
                  }`}
                >
                  <link.icon className="w-4 h-4" /> {link.label}
                </Link>
              ))}
              <Link to="/wallet" onClick={() => setMenuOpen(false)} className="flex items-center gap-2 px-3 py-2 text-slate-300 hover:bg-slate-800 rounded-lg text-sm">
                <WalletIcon className="w-4 h-4" /> Wallet · ₹{walletBalance.toLocaleString('en-IN', { maximumFractionDigits: 0 })}
              </Link>
              <Link to="/profile" onClick={() => setMenuOpen(false)} className="flex items-center gap-2 px-3 py-2 text-slate-300 hover:bg-slate-800 rounded-lg text-sm">
                <User className="w-4 h-4" /> Profile
              </Link>
            </div>
          )}
        </div>
      </nav>
      <LoginModal open={loginOpen} onClose={() => setLoginOpen(false)} />
    </>
  );
};

export default Navbar;
