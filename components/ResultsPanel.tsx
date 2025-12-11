import React from 'react';
import { PricingResult, PricingPath } from '../types';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, ReferenceLine, Area, ComposedChart } from 'recharts';
import { TrendingUp, ShieldCheck, Zap, AlertTriangle, BookOpen } from 'lucide-react';

interface ResultsPanelProps {
  result: PricingResult | null;
}

const ResultsPanel: React.FC<ResultsPanelProps> = ({ result }) => {
  if (!result) {
    return (
      <div className="glass-panel rounded-xl h-full flex flex-col items-center justify-center text-slate-500 p-8 text-center">
        <Zap className="w-16 h-16 mb-4 opacity-20" />
        <h3 className="text-xl font-medium mb-2">Awaiting Computation</h3>
        <p className="max-w-md text-sm opacity-60">
            Define your instrument parameters and run the Quantum Pricing Engine to see path integrals, Greek sensitivities, and Sharia structure notes.
        </p>
      </div>
    );
  }

  // Prepare data for chart: Flatten optimal path for main line, use others for "cloud"
  const chartData = result.optimalPath.map((point, index) => {
    // Combine multiple paths into one data object for the "Cloud" effect
    const cloudPoints: any = {
        name: point.time,
        optimal: point.price,
    };
    result.paths.forEach((path, pathIdx) => {
        cloudPoints[`path_${pathIdx}`] = path[index].price;
    });
    return cloudPoints;
  });

  return (
    <div className="flex flex-col h-full gap-4">
      {/* Top Cards: Metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="glass-panel p-4 rounded-lg border-l-4 border-islamic-gold">
          <p className="text-xs text-slate-400 uppercase">Quantum Fair Value</p>
          <p className="text-2xl font-bold text-white mt-1">
            {result.quantumPrice.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}
          </p>
          <div className="mt-2 text-xs text-green-400 flex items-center">
            <span className="bg-green-500/10 px-1 rounded">{(result.confidence * 100).toFixed(1)}% Conf.</span>
          </div>
        </div>
        
        <div className="glass-panel p-4 rounded-lg border-l-4 border-slate-600">
          <p className="text-xs text-slate-400 uppercase">Classical MC Price</p>
          <p className="text-2xl font-bold text-slate-300 mt-1">
            {result.classicalPrice.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}
          </p>
          <p className="text-xs text-red-400 mt-2">Variance: {((result.classicalPrice - result.quantumPrice)/result.quantumPrice * 100).toFixed(2)}%</p>
        </div>

        <div className="glass-panel p-4 rounded-lg border-l-4 border-quantum-glow">
          <p className="text-xs text-slate-400 uppercase">Bid-Ask Spread</p>
          <p className="text-2xl font-bold text-quantum-glow mt-1">{result.bidAskSpread} bps</p>
          <p className="text-xs text-slate-400 mt-2">vs 15.0 bps (Market)</p>
        </div>

        <div className="glass-panel p-4 rounded-lg border-l-4 border-purple-500">
            <p className="text-xs text-slate-400 uppercase">Greeks</p>
            <div className="flex justify-between mt-2">
                <div>
                    <span className="text-xs text-slate-500 block">Delta</span>
                    <span className="text-lg font-mono">{result.delta.toFixed(2)}</span>
                </div>
                <div>
                    <span className="text-xs text-slate-500 block">Gamma</span>
                    <span className="text-lg font-mono">{result.gamma.toFixed(3)}</span>
                </div>
            </div>
        </div>
      </div>

      {/* Main Chart Area */}
      <div className="glass-panel flex-1 rounded-xl p-6 relative overflow-hidden min-h-[300px]">
        <div className="flex justify-between items-center mb-4">
            <h3 className="font-semibold text-slate-200 flex items-center">
                <TrendingUp className="w-5 h-5 mr-2 text-quantum-glow" />
                Path Integral Convergence
            </h3>
            <div className="flex items-center space-x-4 text-xs">
                <div className="flex items-center">
                    <div className="w-3 h-3 bg-islamic-gold rounded-full mr-2"></div>
                    <span className="text-slate-400">Optimal Wa'd Path</span>
                </div>
                <div className="flex items-center">
                    <div className="w-3 h-3 bg-slate-600/50 rounded-full mr-2"></div>
                    <span className="text-slate-400">Quantum Cloud</span>
                </div>
            </div>
        </div>

        <div className="w-full h-[85%]">
            <ResponsiveContainer width="100%" height="100%">
                <ComposedChart data={chartData}>
                    <defs>
                        <linearGradient id="colorCloud" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#00f0ff" stopOpacity={0.1}/>
                            <stop offset="95%" stopColor="#00f0ff" stopOpacity={0}/>
                        </linearGradient>
                    </defs>
                    <XAxis 
                        dataKey="name" 
                        stroke="#475569" 
                        tick={{fill: '#475569', fontSize: 10}} 
                        tickLine={false}
                    />
                    <YAxis 
                        stroke="#475569" 
                        tick={{fill: '#475569', fontSize: 10}} 
                        tickLine={false}
                        domain={['auto', 'auto']}
                    />
                    <Tooltip 
                        contentStyle={{backgroundColor: '#0f172a', borderColor: '#1e293b', color: '#e2e8f0'}}
                        itemStyle={{color: '#e2e8f0'}}
                    />
                    
                    {/* The Cloud Paths (Simulating quantum probability density) */}
                    {result.paths.map((_, idx) => (
                        <Line 
                            key={idx}
                            type="monotone" 
                            dataKey={`path_${idx}`} 
                            stroke="#00f0ff" 
                            strokeWidth={1} 
                            strokeOpacity={0.15} 
                            dot={false}
                            activeDot={false}
                        />
                    ))}

                    {/* The Optimal Path */}
                    <Line 
                        type="monotone" 
                        dataKey="optimal" 
                        stroke="#D4AF37" 
                        strokeWidth={3} 
                        dot={{fill: '#D4AF37', r: 4}}
                        activeDot={{r: 8, strokeWidth: 0}}
                        filter="drop-shadow(0px 0px 8px rgba(212, 175, 55, 0.5))"
                    />
                </ComposedChart>
            </ResponsiveContainer>
        </div>
      </div>

      {/* Bottom Area: Structuring Notes */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 h-auto">
        <div className="glass-panel p-5 rounded-lg">
            <h4 className="text-sm font-semibold text-islamic-accent flex items-center mb-3">
                <ShieldCheck className="w-4 h-4 mr-2" />
                Sharia Compliance Structure
            </h4>
            <p className="text-sm text-slate-300 leading-relaxed">
                {result.shariaCompliance}
            </p>
        </div>
        <div className="glass-panel p-5 rounded-lg">
            <h4 className="text-sm font-semibold text-islamic-gold flex items-center mb-3">
                <BookOpen className="w-4 h-4 mr-2" />
                Deal Mechanics (Wa'd)
            </h4>
            <p className="text-sm text-slate-300 leading-relaxed">
                {result.structuringNotes}
            </p>
        </div>
      </div>
    </div>
  );
};

export default ResultsPanel;