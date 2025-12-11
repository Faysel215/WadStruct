import React, { useState } from 'react';
import Layout from './components/Layout';
import Structurer from './components/Structurer';
import ResultsPanel from './components/ResultsPanel';
import { InstrumentParams, InstrumentType, Currency, PricingResult } from './types';
import { simulateQuantumPricing } from './services/geminiService';

const App: React.FC = () => {
  const [activeView, setActiveView] = useState('structurer');
  const [pricingResult, setPricingResult] = useState<PricingResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const [instrumentParams, setInstrumentParams] = useState<InstrumentParams>({
    type: InstrumentType.IPRS,
    notional: 10000000,
    currency: Currency.SAR,
    tenorMonths: 60,
    fixedRate: 4.5,
    barrierLevel: 105.50,
    barrierType: 'Knock-Out',
    counterparty: 'Corporate Client A'
  });

  const handleCalculate = async () => {
    setIsLoading(true);
    setPricingResult(null); // Clear previous results
    try {
      const result = await simulateQuantumPricing(instrumentParams);
      setPricingResult(result);
    } catch (error) {
      console.error("Pricing failed:", error);
      alert("Simulation failed. Please check API Key or try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Layout activeView={activeView} setActiveView={setActiveView}>
      <div className="p-4 md:p-8 h-screen box-border flex flex-col">
        {/* Header Area */}
        <div className="mb-6 flex flex-col md:flex-row md:items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-white tracking-tight">Structurer Workspace</h1>
            <p className="text-slate-400 text-sm">
                Project: {instrumentParams.counterparty} | {instrumentParams.type}
            </p>
          </div>
          <div className="mt-4 md:mt-0 flex items-center space-x-3">
             <div className="px-3 py-1 rounded-full bg-slate-800 border border-slate-700 flex items-center">
                <div className="w-2 h-2 rounded-full bg-green-500 mr-2 animate-pulse"></div>
                <span className="text-xs font-mono text-slate-300">API: Connected</span>
             </div>
             <button className="text-xs bg-slate-800 hover:bg-slate-700 text-white px-4 py-2 rounded transition-colors">
                Export Term Sheet
             </button>
          </div>
        </div>

        {/* Content Grid */}
        <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-6 min-h-0">
            {/* Input Column */}
            <div className="lg:col-span-4 h-full overflow-hidden">
                <Structurer 
                    params={instrumentParams} 
                    setParams={setInstrumentParams} 
                    onCalculate={handleCalculate}
                    isLoading={isLoading}
                />
            </div>
            
            {/* Output Column */}
            <div className="lg:col-span-8 h-full overflow-hidden pb-8 lg:pb-0">
                <ResultsPanel result={pricingResult} />
            </div>
        </div>
      </div>
    </Layout>
  );
};

export default App;