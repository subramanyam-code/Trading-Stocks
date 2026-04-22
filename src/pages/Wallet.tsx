import React, { useState } from 'react';
import { Wallet as WalletIcon, Plus, ArrowDown, CreditCard, Building2, Smartphone } from 'lucide-react';
import PageLayout from '@/components/PageLayout';
import { useTrading } from '@/contexts/TradingContext';

const BANK_LIST = [
  'State Bank of India (SBI)',
  'HDFC Bank',
  'ICICI Bank',
  'Axis Bank',
  'Kotak Mahindra Bank',
  'IndusInd Bank',
  'Punjab National Bank (PNB)',
  'Bank of Baroda',
  'Canara Bank',
  'Union Bank of India',
  'IDBI Bank',
  'Federal Bank',
  'Yes Bank',
  'Bandhan Bank',
  'RBL Bank',
  'IDFC First Bank',
];

const QUICK_AMOUNTS = [500, 1000, 5000, 10000, 25000, 50000];

const Wallet: React.FC = () => {
  const { walletBalance, addMoney, withdrawMoney, transactions } = useTrading();
  const [amount, setAmount] = useState('');
  const [method, setMethod] = useState<'UPI' | 'CARD' | 'NETBANKING'>('UPI');
  const [mode, setMode] = useState<'ADD' | 'WITHDRAW'>('ADD');
  
  // Payment method details
  const [upiId, setUpiId] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [cvv, setCvv] = useState('');
  const [bankName, setBankName] = useState('');
  const [accountNumber, setAccountNumber] = useState('');
  const [ifscCode, setIfscCode] = useState('');
  
  const [bankSearch, setBankSearch] = useState('');
  const [showBankList, setShowBankList] = useState(false);

  const handleMethodChange = (newMethod: 'UPI' | 'CARD' | 'NETBANKING') => {
    setMethod(newMethod);
    // Clear all payment details when switching methods
    setUpiId('');
    setCardNumber('');
    setCvv('');
    setBankName('');
    setAccountNumber('');
    setIfscCode('');
  };

  const handleModeChange = (newMode: 'ADD' | 'WITHDRAW') => {
    setMode(newMode);
    // Clear payment details when switching to withdraw mode
    if (newMode === 'WITHDRAW') {
      setUpiId('');
      setCardNumber('');
      setCvv('');
      setBankName('');
      setAccountNumber('');
      setIfscCode('');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const value = parseFloat(amount);
    if (!value || value <= 0) return;
    
    // Validation for payment methods
    if (mode === 'ADD') {
      if (method === 'UPI') {
        const upiRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z]{3,}$/;
        if (!upiId.trim() || !upiRegex.test(upiId)) {
          alert('Please enter a valid UPI ID (e.g., username@paytm or user@googlepay)');
          return;
        }
      }
      if (method === 'CARD') {
        const cardRegex = /^\d{13,19}$/;
        const cvvRegex = /^\d{3,4}$/;
        if (!cardNumber.trim() || !cardRegex.test(cardNumber.replace(/\s/g, ''))) {
          alert('Please enter a valid card number (13-19 digits)');
          return;
        }
        if (!cvv.trim() || !cvvRegex.test(cvv)) {
          alert('Please enter a valid CVV (3-4 digits)');
          return;
        }
      }
      if (method === 'NETBANKING') {
        const accountRegex = /^\d{9,18}$/;
        const ifscRegex = /^[A-Z]{4}0[A-Z0-9]{6}$/;
        if (!bankName.trim()) {
          alert('Please select a bank');
          return;
        }
        if (!accountNumber.trim() || !accountRegex.test(accountNumber)) {
          alert('Please enter a valid account number (9-18 digits)');
          return;
        }
        if (!ifscCode.trim() || !ifscRegex.test(ifscCode.toUpperCase())) {
          alert('Please enter a valid IFSC code (e.g., SBIN0001234)');
          return;
        }
      }
    }
    
    if (mode === 'ADD') addMoney(value);
    else withdrawMoney(value);
    
    // Clear all fields after successful submission
    setAmount('');
    setUpiId('');
    setCardNumber('');
    setCvv('');
    setBankName('');
    setAccountNumber('');
    setIfscCode('');
  };

  const filteredBanks = BANK_LIST.filter(bank =>
    bank.toLowerCase().includes(bankSearch.toLowerCase())
  );

  const walletTxns = transactions.slice(0, 10);

  return (
    <PageLayout>
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold text-white mb-2">Wallet</h1>
        <p className="text-slate-400 text-sm mb-8">Manage your funds and payments</p>

        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <div className="bg-gradient-to-br from-indigo-600/20 via-slate-800 to-emerald-600/10 border border-slate-700 rounded-2xl p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-emerald-500/20 rounded-lg flex items-center justify-center">
                <WalletIcon className="w-5 h-5 text-emerald-400" />
              </div>
              <div>
                <div className="text-slate-400 text-xs">Available Balance</div>
                <div className="text-white font-semibold">StockTrade Wallet</div>
              </div>
            </div>
            <div className="text-4xl font-bold text-white mb-6">
              ₹{walletBalance.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </div>
            <div className="flex gap-2">
              <button onClick={() => handleModeChange('ADD')} className={`flex-1 py-2 rounded-lg text-sm font-medium ${mode === 'ADD' ? 'bg-emerald-500 text-white' : 'bg-slate-700 text-slate-300'}`}>
                <Plus className="w-4 h-4 inline mr-1" /> Add Money
              </button>
              <button onClick={() => handleModeChange('WITHDRAW')} className={`flex-1 py-2 rounded-lg text-sm font-medium ${mode === 'WITHDRAW' ? 'bg-red-500 text-white' : 'bg-slate-700 text-slate-300'}`}>
                <ArrowDown className="w-4 h-4 inline mr-1" /> Withdraw
              </button>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="bg-slate-800/60 border border-slate-700 rounded-2xl p-6">
            <h3 className="text-white font-semibold mb-4">{mode === 'ADD' ? 'Add Money' : 'Withdraw'}</h3>
            <div className="mb-4">
              <label className="text-xs text-slate-400 mb-1 block">Amount</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">₹</span>
                <input type="number" value={amount} onChange={e => setAmount(e.target.value)} placeholder="0"
                  className="w-full bg-slate-900 border border-slate-700 text-white text-lg rounded-lg pl-7 pr-3 py-2.5 focus:outline-none focus:border-emerald-500" />
              </div>
              <div className="flex gap-2 mt-2 flex-wrap">
                {QUICK_AMOUNTS.map(a => (
                  <button key={a} type="button" onClick={() => setAmount(a.toString())}
                    className="text-xs bg-slate-700 hover:bg-slate-600 text-slate-300 px-3 py-1 rounded-full">
                    ₹{a.toLocaleString('en-IN')}
                  </button>
                ))}
              </div>
            </div>

            {mode === 'ADD' && (
              <div className="mb-4">
                <label className="text-xs text-slate-400 mb-2 block">Payment Method</label>
                <div className="grid grid-cols-3 gap-2">
                  {([['UPI', Smartphone], ['CARD', CreditCard], ['NETBANKING', Building2]] as const).map(([m, Icon]) => (
                    <button key={m} type="button" onClick={() => handleMethodChange(m)}
                      className={`p-3 rounded-lg border text-xs font-medium flex flex-col items-center gap-1 ${
                        method === m ? 'border-emerald-500 bg-emerald-500/10 text-emerald-400' : 'border-slate-700 bg-slate-900 text-slate-400'
                      }`}>
                      <Icon className="w-4 h-4" />
                      {m}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {mode === 'ADD' && method === 'UPI' && (
              <div className="mb-4">
                <label className="text-xs text-slate-400 mb-2 block">Select UPI App</label>
                <div className="grid grid-cols-3 gap-2 mb-3">
                  <button
                    type="button"
                    onClick={() => setUpiId('user@paytm')}
                    className="flex flex-col items-center gap-2 p-3 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-lg transition-colors"
                  >
                    <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
                      <span className="text-white font-bold text-xs">P</span>
                    </div>
                    <span className="text-xs text-slate-300">PhonePe</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setUpiId('user@okhdfcbank')}
                    className="flex flex-col items-center gap-2 p-3 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-lg transition-colors"
                  >
                    <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
                      <span className="text-black font-bold text-xs">G</span>
                    </div>
                    <span className="text-xs text-slate-300">Google Pay</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setUpiId('user@paytm')}
                    className="flex flex-col items-center gap-2 p-3 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-lg transition-colors"
                  >
                    <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                      <span className="text-white font-bold text-xs">P</span>
                    </div>
                    <span className="text-xs text-slate-300">Paytm</span>
                  </button>
                </div>
                <input 
                  type="text" 
                  value={upiId} 
                  onChange={e => setUpiId(e.target.value)} 
                  placeholder="Enter your UPI ID (e.g., user@paytm)"
                  className="w-full bg-slate-900 border border-slate-700 text-white rounded-lg px-3 py-2.5 focus:outline-none focus:border-emerald-500" 
                />
              </div>
            )}

            {mode === 'ADD' && method === 'CARD' && (
              <div className="mb-4 space-y-3">
                <div>
                  <label className="text-xs text-slate-400 mb-2 block">Card Number</label>
                  <input 
                    type="text" 
                    value={cardNumber} 
                    onChange={e => setCardNumber(e.target.value)} 
                    placeholder="Enter card number"
                    className="w-full bg-slate-900 border border-slate-700 text-white rounded-lg px-3 py-2.5 focus:outline-none focus:border-emerald-500" 
                  />
                </div>
                <div>
                  <label className="text-xs text-slate-400 mb-2 block">CVV</label>
                  <input 
                    type="text" 
                    value={cvv} 
                    onChange={e => setCvv(e.target.value)} 
                    placeholder="Enter CVV"
                    className="w-full bg-slate-900 border border-slate-700 text-white rounded-lg px-3 py-2.5 focus:outline-none focus:border-emerald-500" 
                  />
                </div>
              </div>
            )}

            {mode === 'ADD' && method === 'NETBANKING' && (
              <div className="mb-4 space-y-3">
                <div>
                  <label className="text-xs text-slate-400 mb-2 block">Select Bank</label>
                  <div className="relative">
                    <input
                      type="text"
                      value={bankSearch}
                      onChange={e => { setBankSearch(e.target.value); setShowBankList(true); }}
                      onFocus={() => setShowBankList(true)}
                      onBlur={() => setTimeout(() => setShowBankList(false), 200)}
                      placeholder="Search for your bank..."
                      className="w-full bg-slate-900 border border-slate-700 text-white rounded-lg px-3 py-2.5 focus:outline-none focus:border-emerald-500"
                    />
                    {showBankList && filteredBanks.length > 0 && (
                      <div className="absolute top-full mt-1 w-full bg-slate-800 border border-slate-700 rounded-lg shadow-lg max-h-40 overflow-y-auto z-10">
                        {filteredBanks.map(bank => (
                          <button
                            key={bank}
                            type="button"
                            onClick={() => { setBankName(bank); setBankSearch(bank); setShowBankList(false); }}
                            className="w-full px-3 py-2 text-left text-slate-300 hover:bg-slate-700 hover:text-white text-sm"
                          >
                            {bank}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
                <div>
                  <label className="text-xs text-slate-400 mb-2 block">Account Number</label>
                  <input 
                    type="text" 
                    value={accountNumber} 
                    onChange={e => setAccountNumber(e.target.value)} 
                    placeholder="Enter account number"
                    className="w-full bg-slate-900 border border-slate-700 text-white rounded-lg px-3 py-2.5 focus:outline-none focus:border-emerald-500" 
                  />
                </div>
                <div>
                  <label className="text-xs text-slate-400 mb-2 block">IFSC Code</label>
                  <input 
                    type="text" 
                    value={ifscCode} 
                    onChange={e => setIfscCode(e.target.value)} 
                    placeholder="Enter IFSC code"
                    className="w-full bg-slate-900 border border-slate-700 text-white rounded-lg px-3 py-2.5 focus:outline-none focus:border-emerald-500" 
                  />
                </div>
              </div>
            )}

            <button type="submit" className={`w-full py-3 rounded-lg font-semibold text-white ${mode === 'ADD' ? 'bg-emerald-500 hover:bg-emerald-600' : 'bg-red-500 hover:bg-red-600'}`}>
              {mode === 'ADD' ? `Add ₹${amount || '0'}` : `Withdraw ₹${amount || '0'}`}
            </button>
          </form>
        </div>

        {walletTxns.length > 0 && (
          <div className="bg-slate-800/60 border border-slate-700 rounded-xl overflow-hidden">
            <div className="p-5 border-b border-slate-700">
              <h3 className="text-white font-semibold">Recent Transactions</h3>
            </div>
            <div className="divide-y divide-slate-700">
              {walletTxns.map(t => (
                <div key={t.id} className="p-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${t.type === 'BUY' ? 'bg-red-500/10' : 'bg-emerald-500/10'}`}>
                      {t.type === 'BUY' ? <ArrowDown className="w-4 h-4 text-red-400" /> : <Plus className="w-4 h-4 text-emerald-400" />}
                    </div>
                    <div>
                      <div className="text-white text-sm font-medium">{t.type} {t.symbol}</div>
                      <div className="text-xs text-slate-400">{new Date(t.timestamp).toLocaleString('en-IN')}</div>
                    </div>
                  </div>
                  <div className={`font-semibold ${t.type === 'SELL' ? 'text-emerald-400' : 'text-red-400'}`}>
                    {t.type === 'SELL' ? '+' : '-'}₹{t.total.toFixed(2)}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </PageLayout>
  );
};

export default Wallet;
