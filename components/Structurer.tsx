import React from 'react';
import { InstrumentParams, InstrumentType, Currency } from '../types';
import { Settings2, Info } from 'lucide-react';

interface StructurerProps {
  params: InstrumentParams;
  setParams: React.Dispatch<React.SetStateAction<InstrumentParams>>;
  onCalculate: () => void;
  isLoading: boolean;
}

const Structurer: React.FC<StructurerProps> = ({ params, setParams, onCalculate, isLoading }) => {
  const handleChange = (field: keyof InstrumentParams, value: any) => {
    setParams(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="glass-panel rounded-xl p-6 h-full flex flex-col relative overflow-hidden">
        {/* Decorator */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-islamic-gold/5 rounded-full blur-3xl -mr-10 -mt-10 pointer-events-none"></div>

      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-white flex items-center">
          <Settings2 className="w-5 h-5 mr-2 text-islamic-gold" />
          Define Instrument
        </h2>
      </div>

      <div className="space-y-6 overflow-y-auto pr-2 custom-scrollbar">
        {/* Instrument Type */}
        <div className="space-y-2">
          <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Product Type</label>
          <div className="grid grid-cols-3 gap-2">
            {Object.values(InstrumentType).map((type) => (
              <button
                key={type}
                onClick={() => handleChange('type', type)}
                className={`py-2 px-3 rounded-md text-sm font-medium transition-all ${
                  params.type === type
                    ? 'bg-islamic-accent text-white shadow-lg shadow-islamic-accent/20'
                    : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
                }`}
              >
                {type}
              </button>
            ))}
          </div>
        </div>

        {/* Notional & Currency */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Notional</label>
            <input
              type="number"
              value={params.notional}
              onChange={(e) => handleChange('notional', Number(e.target.value))}
              className="w-full bg-slate-900/80 border border-slate-700 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-islamic-gold focus:ring-1 focus:ring-islamic-gold transition-colors"
            />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Currency</label>
            <select
              value={params.currency}
              onChange={(e) => handleChange('currency', e.target.value)}
              className="w-full bg-slate-900/80 border border-slate-700 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-islamic-gold"
            >
              {Object.values(Currency).map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
        </div>

        {/* Tenor & Rate */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Tenor (Months)</label>
            <input
              type="number"
              value={params.tenorMonths}
              onChange={(e) => handleChange('tenorMonths', Number(e.target.value))}
              className="w-full bg-slate-900/80 border border-slate-700 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-islamic-gold"
            />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Fixed Profit Rate (%)</label>
            <input
              type="number"
              step="0.01"
              value={params.fixedRate}
              onChange={(e) => handleChange('fixedRate', Number(e.target.value))}
              className="w-full bg-slate-900/80 border border-slate-700 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-islamic-gold"
            />
          </div>
        </div>

        {/* Path Dependent Features */}
        <div className="p-4 bg-slate-800/30 rounded-lg border border-slate-700/50">
            <div className="flex items-center mb-3">
                <Info className="w-4 h-4 text-quantum-glow mr-2" />
                <span className="text-sm font-semibold text-quantum-glow">Wa'd Trigger Events</span>
            </div>
            <div className="space-y-3">
                <div className="space-y-1">
                    <label className="text-xs text-slate-400">Barrier Level (Price)</label>
                    <input
                        type="number"
                        placeholder="e.g. 110.00"
                        value={params.barrierLevel || ''}
                        onChange={(e) => handleChange('barrierLevel', Number(e.target.value))}
                        className="w-full bg-slate-900 border border-slate-700 rounded px-3 py-2 text-sm text-white focus:border-quantum-glow focus:outline-none"
                    />
                </div>
                <div className="space-y-1">
                    <label className="text-xs text-slate-400">Barrier Type</label>
                    <div className="flex space-x-2">
                        {['Knock-In', 'Knock-Out'].map(b => (
                            <button
                                key={b}
                                onClick={() => handleChange('barrierType', b)}
                                className={`flex-1 py-1.5 text-xs rounded border ${params.barrierType === b ? 'bg-quantum-glow/10 border-quantum-glow text-quantum-glow' : 'border-slate-700 text-slate-500'}`}
                            >
                                {b}
                            </button>
                        ))}
                    </div>
                </div>
            </div>
        </div>

      </div>

      <div className="mt-auto pt-6">
        <button
          onClick={onCalculate}
          disabled={isLoading}
          className={`w-full py-4 rounded-lg font-bold text-lg tracking-wide transition-all shadow-lg ${
            isLoading 
              ? 'bg-slate-700 text-slate-400 cursor-not-allowed' 
              : 'bg-gradient-to-r from-islamic-gold to-yellow-600 text-slate-900 hover:shadow-islamic-gold/20 hover:scale-[1.01]'
          }`}
        >
          {isLoading ? (
            <span className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Processing Quantum Path...
            </span>
          ) : (
            'RUN QUANTUM PRICING'
          )}
        </button>
      </div>
    </div>
  );
};

export default Structurer;