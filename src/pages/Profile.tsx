import React, { useState } from 'react';
import { User, Mail, Phone, FileText, Copy, Check, Plus, Trash2, MessageCircle, Award, Calendar } from 'lucide-react';
import PageLayout from '@/components/PageLayout';
import { useTrading } from '@/contexts/TradingContext';
import { toast } from 'sonner';

const Profile: React.FC = () => {
  const { profile, bankAccounts, addBankAccount, removeBankAccount, supportTickets, createTicket, walletBalance, holdings, transactions, updateProfile } = useTrading();
  const [copied, setCopied] = useState(false);
  const [showBank, setShowBank] = useState(false);
  const [showTicket, setShowTicket] = useState(false);
  const [bankForm, setBankForm] = useState({ bankName: '', accountNumber: '', ifsc: '' });
  const [ticketForm, setTicketForm] = useState({ subject: '', message: '' });
  const [editName, setEditName] = useState(profile.name);
  const [editPhone, setEditPhone] = useState(profile.phone);

  const copyRef = () => {
    navigator.clipboard.writeText(profile.referralCode);
    setCopied(true);
    toast.success('Referral code copied!');
    setTimeout(() => setCopied(false), 2000);
  };

  const joinedDate = new Date(profile.joinedAt);
  const joinedText = joinedDate.toLocaleDateString('en-IN', { month: 'long', year: 'numeric' });

  const handleBank = (e: React.FormEvent) => {
    e.preventDefault();
    if (!bankForm.bankName || !bankForm.accountNumber) return;
    addBankAccount({ ...bankForm, isPrimary: bankAccounts.length === 0 });
    setBankForm({ bankName: '', accountNumber: '', ifsc: '' });
    setShowBank(false);
  };

  const handleTicket = (e: React.FormEvent) => {
    e.preventDefault();
    if (!ticketForm.subject || !ticketForm.message) return;
    createTicket(ticketForm.subject, ticketForm.message);
    setTicketForm({ subject: '', message: '' });
    setShowTicket(false);
  };

  const handleProfileSave = () => {
    updateProfile({ name: editName, phone: editPhone });
  };

  return (
    <PageLayout>
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="bg-gradient-to-r from-slate-800 to-slate-900 border border-slate-700 rounded-2xl p-6 mb-6">
          <div className="flex items-center gap-4 flex-wrap">
            <div className="w-20 h-20 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-2xl">
              {profile.name.charAt(0).toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <h1 className="text-2xl font-bold text-white">{profile.name}</h1>
              <p className="text-slate-400 text-sm">{profile.email}</p>
              <div className="flex items-center gap-1 text-xs text-emerald-400 mt-1">
                <Calendar className="w-3 h-3" /> Growing since {joinedText}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3 mt-6 pt-6 border-t border-slate-700">
            <Stat label="Portfolio" value={holdings.length.toString()} />
            <Stat label="Orders" value={transactions.length.toString()} />
            <Stat label="Wallet" value={`₹${walletBalance.toLocaleString('en-IN', { maximumFractionDigits: 0 })}`} />
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Personal Info */}
          <div className="bg-slate-800/60 border border-slate-700 rounded-xl p-5">
            <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
              <User className="w-4 h-4" /> Personal Information
            </h3>
            <div className="space-y-3">
              <Field label="Full Name" value={editName} onChange={setEditName} />
              <Field label="Email (Cognito)" value={profile.email} readonly />
              <Field label="Phone" value={editPhone} onChange={setEditPhone} />
              <Field label="PAN" value={profile.pan} readonly />
              <button onClick={handleProfileSave} className="w-full bg-emerald-500 hover:bg-emerald-600 text-white py-2 rounded-lg text-sm font-medium">
                Save Changes
              </button>
            </div>
          </div>

          {/* Referral */}
          <div className="bg-gradient-to-br from-emerald-500/10 to-indigo-500/10 border border-emerald-500/30 rounded-xl p-5">
            <div className="flex items-center gap-2 mb-3">
              <Award className="w-5 h-5 text-emerald-400" />
              <h3 className="text-white font-semibold">Refer & Earn</h3>
            </div>
            <p className="text-slate-400 text-sm mb-4">Invite friends and earn ₹500 in your wallet for each successful referral.</p>
            <div className="bg-slate-900 border border-slate-700 rounded-lg p-3 flex items-center justify-between">
              <code className="text-emerald-400 font-mono font-bold">{profile.referralCode}</code>
              <button onClick={copyRef} className="text-slate-400 hover:text-white">
                {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
              </button>
            </div>
            <div className="grid grid-cols-2 gap-3 mt-4 text-center">
              <div className="bg-slate-900/50 rounded-lg p-3">
                <div className="text-xs text-slate-400">Referrals</div>
                <div className="text-white font-bold text-lg">0</div>
              </div>
              <div className="bg-slate-900/50 rounded-lg p-3">
                <div className="text-xs text-slate-400">Earned</div>
                <div className="text-emerald-400 font-bold text-lg">₹0</div>
              </div>
            </div>
          </div>

          {/* Bank Accounts */}
          <div className="bg-slate-800/60 border border-slate-700 rounded-xl p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-white font-semibold">Bank Accounts</h3>
              <button onClick={() => setShowBank(!showBank)} className="text-emerald-400 text-sm flex items-center gap-1 hover:underline">
                <Plus className="w-3 h-3" /> Add
              </button>
            </div>
            {showBank && (
              <form onSubmit={handleBank} className="bg-slate-900/50 p-3 rounded-lg mb-3 space-y-2">
                <input value={bankForm.bankName} onChange={e => setBankForm({ ...bankForm, bankName: e.target.value })} placeholder="Bank Name (HDFC)" className="w-full bg-slate-800 border border-slate-700 text-white text-sm rounded-lg px-3 py-2 focus:outline-none focus:border-emerald-500" />
                <input value={bankForm.accountNumber} onChange={e => setBankForm({ ...bankForm, accountNumber: e.target.value })} placeholder="Account Number" className="w-full bg-slate-800 border border-slate-700 text-white text-sm rounded-lg px-3 py-2 focus:outline-none focus:border-emerald-500" />
                <input value={bankForm.ifsc} onChange={e => setBankForm({ ...bankForm, ifsc: e.target.value })} placeholder="IFSC Code" className="w-full bg-slate-800 border border-slate-700 text-white text-sm rounded-lg px-3 py-2 focus:outline-none focus:border-emerald-500" />
                <button type="submit" className="w-full bg-emerald-500 hover:bg-emerald-600 text-white py-2 rounded-lg text-sm font-medium">Add Bank</button>
              </form>
            )}
            {bankAccounts.length === 0 ? (
              <p className="text-slate-500 text-sm text-center py-4">No bank accounts added</p>
            ) : (
              <div className="space-y-2">
                {bankAccounts.map(b => (
                  <div key={b.id} className="bg-slate-900/50 rounded-lg p-3 flex items-center justify-between">
                    <div>
                      <div className="text-white text-sm font-medium">{b.bankName}</div>
                      <div className="text-xs text-slate-400">•••• {b.accountNumber.slice(-4)} · {b.ifsc}</div>
                    </div>
                    <button onClick={() => removeBankAccount(b.id)} className="text-red-400 hover:bg-red-500/10 p-1 rounded">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Support Tickets */}
          <div className="bg-slate-800/60 border border-slate-700 rounded-xl p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-white font-semibold flex items-center gap-2">
                <MessageCircle className="w-4 h-4" /> Support Tickets
              </h3>
              <button onClick={() => setShowTicket(!showTicket)} className="text-emerald-400 text-sm flex items-center gap-1 hover:underline">
                <Plus className="w-3 h-3" /> New
              </button>
            </div>
            {showTicket && (
              <form onSubmit={handleTicket} className="bg-slate-900/50 p-3 rounded-lg mb-3 space-y-2">
                <input value={ticketForm.subject} onChange={e => setTicketForm({ ...ticketForm, subject: e.target.value })} placeholder="Subject" className="w-full bg-slate-800 border border-slate-700 text-white text-sm rounded-lg px-3 py-2 focus:outline-none focus:border-emerald-500" />
                <textarea value={ticketForm.message} onChange={e => setTicketForm({ ...ticketForm, message: e.target.value })} placeholder="Describe your issue..." rows={3} className="w-full bg-slate-800 border border-slate-700 text-white text-sm rounded-lg px-3 py-2 focus:outline-none focus:border-emerald-500" />
                <button type="submit" className="w-full bg-emerald-500 hover:bg-emerald-600 text-white py-2 rounded-lg text-sm font-medium">Submit</button>
              </form>
            )}
            {supportTickets.length === 0 ? (
              <p className="text-slate-500 text-sm text-center py-4">No tickets raised</p>
            ) : (
              <div className="space-y-2">
                {supportTickets.map(t => (
                  <div key={t.id} className="bg-slate-900/50 rounded-lg p-3">
                    <div className="flex justify-between items-start mb-1">
                      <div className="text-white text-sm font-medium">{t.subject}</div>
                      <span className={`text-xs px-2 py-0.5 rounded-full ${t.status === 'OPEN' ? 'bg-yellow-500/10 text-yellow-400' : 'bg-emerald-500/10 text-emerald-400'}`}>{t.status}</span>
                    </div>
                    <div className="text-xs text-slate-400">{t.message}</div>
                    <div className="text-xs text-slate-500 mt-1">{new Date(t.createdAt).toLocaleString('en-IN')}</div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </PageLayout>
  );
};

const Stat: React.FC<{ label: string; value: string }> = ({ label, value }) => (
  <div>
    <div className="text-xs text-slate-400">{label}</div>
    <div className="text-white font-bold text-lg">{value}</div>
  </div>
);

const Field: React.FC<{ label: string; value: string; onChange?: (v: string) => void; readonly?: boolean }> = ({ label, value, onChange, readonly }) => (
  <div>
    <label className="text-xs text-slate-400 block mb-1">{label}</label>
    <input type="text" value={value} readOnly={readonly} onChange={e => onChange?.(e.target.value)}
      className={`w-full bg-slate-900 border border-slate-700 text-white text-sm rounded-lg px-3 py-2 focus:outline-none ${readonly ? 'opacity-70' : 'focus:border-emerald-500'}`} />
  </div>
);

export default Profile;
