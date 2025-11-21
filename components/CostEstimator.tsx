import React, { useState } from 'react';
import { Calculator, Loader2, MapPin, Copy, Check, Coins } from 'lucide-react';
import { estimateRenovationCost } from '../services/geminiService';
import { CostEstimationResult, BudgetTier } from '../types';

interface CostEstimatorProps {
  resultImage: string;
}

const CURRENCIES = [
  { code: 'USD', symbol: '$' },
  { code: 'EUR', symbol: '€' },
  { code: 'GBP', symbol: '£' },
  { code: 'INR', symbol: '₹' },
  { code: 'JPY', symbol: '¥' },
  { code: 'CAD', symbol: '$' },
  { code: 'AUD', symbol: '$' },
];

const CostEstimator: React.FC<CostEstimatorProps> = ({ resultImage }) => {
  const [location, setLocation] = useState('');
  const [currency, setCurrency] = useState('USD');
  const [estimation, setEstimation] = useState<CostEstimationResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const handleEstimate = async () => {
    if (!location) {
      setError("Please provide a location.");
      return;
    }

    setIsLoading(true);
    setError(null);
    setEstimation(null);

    try {
      const result = await estimateRenovationCost(resultImage, location, currency);
      setEstimation(result);
    } catch (err) {
      setError("Failed to generate estimation. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = () => {
    if (!estimation) return;

    const formatTier = (tier: BudgetTier) => {
      const items = tier.items.map(i => `${i.item}: ${i.cost}`).join('\n');
      return `--- ${tier.tierName} ---\n${tier.description}\n\n${items}\n\nTOTAL: ${tier.total}`;
    };

    const text = `ESTIMATION FOR ${location.toUpperCase()} (${currency})\n\n${formatTier(estimation.luxury)}\n\n${formatTier(estimation.affordable)}`;
    
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const renderTable = (tier: BudgetTier) => (
    <div className="w-full border border-black dark:border-white mb-6 last:mb-0 rounded-md overflow-hidden">
      <div className="p-4 border-b border-black dark:border-white bg-gray-50 dark:bg-zinc-900">
        <h3 className="text-sm font-bold uppercase tracking-wider text-black dark:text-white">
          {tier.tierName}
        </h3>
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 font-mono">
          {tier.description}
        </p>
      </div>
      <div className="w-full overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-gray-200 dark:border-zinc-800 text-xs uppercase font-mono text-gray-500 dark:text-gray-400">
              <th className="p-3 font-normal">Item</th>
              <th className="p-3 font-normal text-right">Est. Cost</th>
            </tr>
          </thead>
          <tbody className="text-sm font-mono text-black dark:text-white">
            {tier.items.map((item, idx) => (
              <tr key={idx} className="border-b border-gray-100 dark:border-zinc-800 last:border-0 hover:bg-gray-50 dark:hover:bg-zinc-900/50 transition-colors">
                <td className="p-3 border-r border-gray-100 dark:border-zinc-800">{item.item}</td>
                <td className="p-3 text-right">{item.cost}</td>
              </tr>
            ))}
          </tbody>
          <tfoot className="bg-gray-50 dark:bg-zinc-900 font-bold text-black dark:text-white">
            <tr>
              <td className="p-3 border-t border-black dark:border-white uppercase text-xs tracking-wider">Total Estimated</td>
              <td className="p-3 border-t border-black dark:border-white text-right font-mono">{tier.total}</td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );

  return (
    <div className="w-full mt-8 border-t border-black dark:border-white pt-8">
      <h2 className="text-sm font-mono uppercase tracking-widest mb-6 text-black dark:text-white flex items-center gap-2">
        <Calculator size={16} />
        Cost Estimator
      </h2>

      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="relative flex-grow">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <MapPin size={14} className="text-gray-500" />
          </div>
          <input
            type="text"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder="Enter your city (e.g. New York, London)"
            className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-700 bg-transparent focus:border-black dark:focus:border-white outline-none transition-colors text-sm text-black dark:text-white placeholder-gray-400 rounded-md"
          />
        </div>

        <div className="relative w-full md:w-1/4">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Coins size={14} className="text-gray-500" />
          </div>
          <select
            value={currency}
            onChange={(e) => setCurrency(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-700 bg-transparent focus:border-black dark:focus:border-white outline-none transition-colors text-sm text-black dark:text-white appearance-none cursor-pointer rounded-md"
          >
            {CURRENCIES.map((c) => (
              <option key={c.code} value={c.code} className="bg-white dark:bg-black">
                {c.code} ({c.symbol})
              </option>
            ))}
          </select>
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-gray-500 text-xs">
            ▼
          </div>
        </div>

        <button
            onClick={handleEstimate}
            disabled={isLoading || !location}
            className="md:w-auto px-6 py-3 bg-black dark:bg-white text-white dark:text-black text-xs uppercase font-bold tracking-widest hover:opacity-80 disabled:opacity-50 transition-opacity flex items-center justify-center gap-2 whitespace-nowrap rounded-md"
        >
            {isLoading ? <Loader2 className="animate-spin" size={14} /> : <Calculator size={14} />}
            Calculate
        </button>
      </div>

      {error && (
        <p className="mt-4 text-red-500 text-xs font-mono border border-red-200 p-2 bg-red-50 dark:bg-red-900/10 rounded-md">{error}</p>
      )}

      {estimation && (
        <div className="mt-8 animate-fade-in">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xs font-bold uppercase text-black dark:text-white">
              Estimation Report ({currency})
            </h3>
            <button 
              onClick={handleCopy}
              className="flex items-center gap-1 text-xs font-mono uppercase hover:underline text-gray-500 hover:text-black dark:text-gray-400 dark:hover:text-white"
            >
              {copied ? <Check size={14} /> : <Copy size={14} />}
              {copied ? "Copied" : "Copy Text"}
            </button>
          </div>
          
          <div className="grid grid-cols-1 gap-6">
             {renderTable(estimation.luxury)}
             {renderTable(estimation.affordable)}
          </div>
        </div>
      )}
    </div>
  );
};

export default CostEstimator;