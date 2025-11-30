import React, { useState, useEffect } from 'react';
import { Calculator, MapPin, Copy, Check, Coins, Globe } from 'lucide-react';
import { estimateRenovationCost } from '../services/geminiService';
import { CostEstimationResult, BudgetTier } from '../types';
import LoadingOverlay from './LoadingOverlay';

interface CostEstimatorProps {
  resultImage: string;
}

const COUNTRIES = [
  { name: "United States", currency: "USD", symbol: "$" },
  { name: "India", currency: "INR", symbol: "₹" },
  { name: "United Kingdom", currency: "GBP", symbol: "£" },
  { name: "Germany", currency: "EUR", symbol: "€" },
  { name: "France", currency: "EUR", symbol: "€" },
  { name: "Canada", currency: "CAD", symbol: "$" },
  { name: "Australia", currency: "AUD", symbol: "$" },
  { name: "Japan", currency: "JPY", symbol: "¥" },
  { name: "China", currency: "CNY", symbol: "¥" },
  { name: "Brazil", currency: "BRL", symbol: "R$" },
  { name: "Italy", currency: "EUR", symbol: "€" },
  { name: "Spain", currency: "EUR", symbol: "€" },
  { name: "Russia", currency: "RUB", symbol: "₽" },
  { name: "Mexico", currency: "MXN", symbol: "$" },
  { name: "South Korea", currency: "KRW", symbol: "₩" },
  { name: "Indonesia", currency: "IDR", symbol: "Rp" },
  { name: "Turkey", currency: "TRY", symbol: "₺" },
  { name: "Saudi Arabia", currency: "SAR", symbol: "﷼" },
  { name: "Switzerland", currency: "CHF", symbol: "Fr" },
  { name: "South Africa", currency: "ZAR", symbol: "R" },
  { name: "United Arab Emirates", currency: "AED", symbol: "د.إ" },
  { name: "Singapore", currency: "SGD", symbol: "$" },
  { name: "New Zealand", currency: "NZD", symbol: "$" },
  { name: "Sweden", currency: "SEK", symbol: "kr" },
  { name: "Other (USD)", currency: "USD", symbol: "$" }
];

const CostEstimator: React.FC<CostEstimatorProps> = ({ resultImage }) => {
  const [selectedCountry, setSelectedCountry] = useState(COUNTRIES[0].name);
  const [currency, setCurrency] = useState(COUNTRIES[0].currency);
  const [currentSymbol, setCurrentSymbol] = useState(COUNTRIES[0].symbol);
  const [estimation, setEstimation] = useState<CostEstimationResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  // Handle Country Change
  const handleCountryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const countryName = e.target.value;
    setSelectedCountry(countryName);
    const countryData = COUNTRIES.find(c => c.name === countryName);
    if (countryData) {
      setCurrency(countryData.currency);
      setCurrentSymbol(countryData.symbol);
    }
  };

  const handleEstimate = async () => {
    setIsLoading(true);
    setError(null);
    setEstimation(null);

    try {
      const result = await estimateRenovationCost(resultImage, selectedCountry, currency);
      setEstimation(result);
    } catch (err) {
      setError("Failed to generate estimation. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const formatCost = (amount: string) => {
    // Remove any existing non-numeric characters (except dot) to be safe
    const cleanAmount = amount.replace(/[^0-9.]/g, '');
    const number = parseFloat(cleanAmount);
    if (isNaN(number)) return amount;
    return `${currentSymbol}${number.toLocaleString()}`;
  };

  const handleCopy = () => {
    if (!estimation) return;

    const formatTier = (tier: BudgetTier) => {
      const items = tier.items.map(i => `${i.item}: ${formatCost(i.cost)}`).join('\n');
      return `--- ${tier.tierName} ---\n${tier.description}\n\n${items}\n\nTOTAL: ${formatCost(tier.total)}`;
    };

    const text = `ESTIMATION FOR ${selectedCountry.toUpperCase()} (${currency})\n\n${formatTier(estimation.luxury)}\n\n${formatTier(estimation.affordable)}`;
    
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const renderTable = (tier: BudgetTier) => (
    <div className="w-full border border-black dark:border-white mb-6 last:mb-0 rounded-md overflow-hidden bg-white dark:bg-black shadow-sm">
      <div className="p-4 border-b border-black dark:border-white bg-gray-50 dark:bg-slate-900">
        <h3 className="text-sm font-bold uppercase tracking-wider text-black dark:text-white font-sans">
          {tier.tierName}
        </h3>
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 font-sans">
          {tier.description}
        </p>
      </div>
      <div className="w-full overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-gray-200 dark:border-slate-800 text-xs uppercase font-sans font-medium text-gray-500 dark:text-gray-400">
              <th className="p-3 font-medium">Item</th>
              <th className="p-3 font-medium text-right">Est. Cost</th>
            </tr>
          </thead>
          <tbody className="text-sm font-sans text-black dark:text-white">
            {tier.items.map((item, idx) => (
              <tr key={idx} className="border-b border-gray-100 dark:border-slate-800 last:border-0 hover:bg-gray-50 dark:hover:bg-slate-900/50 transition-colors">
                <td className="p-3 border-r border-gray-100 dark:border-slate-800">{item.item}</td>
                <td className="p-3 text-right font-medium font-mono">{formatCost(item.cost)}</td>
              </tr>
            ))}
          </tbody>
          <tfoot className="bg-gray-50 dark:bg-slate-900 font-bold text-black dark:text-white">
            <tr>
              <td className="p-3 border-t border-black dark:border-white uppercase text-xs tracking-wider font-sans">Total Estimated</td>
              <td className="p-3 border-t border-black dark:border-white text-right font-mono">{formatCost(tier.total)}</td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );

  return (
    <>
      <LoadingOverlay isVisible={isLoading} message="Calculating local market rates..." />
      
      <div className="w-full mt-8 border-t border-black dark:border-white pt-8">
        <h2 className="text-sm font-sans uppercase font-bold tracking-widest mb-6 text-black dark:text-white flex items-center gap-2">
          <Calculator size={16} />
          Cost Estimator
        </h2>

        <div className="flex flex-col md:flex-row gap-4 mb-6">
          {/* Country Selector */}
          <div className="relative flex-grow">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Globe size={14} className="text-gray-500" />
            </div>
            <select
              value={selectedCountry}
              onChange={handleCountryChange}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-900 focus:border-black dark:focus:border-white outline-none transition-colors text-sm text-black dark:text-white appearance-none cursor-pointer rounded-md shadow-sm font-sans"
            >
              {COUNTRIES.map((c) => (
                <option key={c.name} value={c.name}>
                  {c.name}
                </option>
              ))}
            </select>
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-gray-500 text-xs">
              ▼
            </div>
          </div>

          {/* Read-only Currency Display */}
          <div className="relative w-full md:w-1/4">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Coins size={14} className="text-gray-500" />
            </div>
            <input
              type="text"
              value={`${currency} (${currentSymbol})`}
              readOnly
              className="w-full pl-10 pr-4 py-3 border border-gray-200 dark:border-slate-800 bg-gray-50 dark:bg-slate-900 text-gray-500 dark:text-gray-400 outline-none text-sm rounded-md cursor-not-allowed font-sans"
              title="Currency is automatically set based on country"
            />
          </div>

          <button
              onClick={handleEstimate}
              disabled={isLoading}
              className="md:w-auto px-6 py-3 bg-black dark:bg-white text-white dark:text-black text-xs uppercase font-bold tracking-widest hover:bg-slate-800 dark:hover:bg-slate-200 transition-colors flex items-center justify-center gap-2 whitespace-nowrap rounded-md shadow-md font-sans"
          >
              <Calculator size={14} />
              Calculate
          </button>
        </div>

        {error && (
          <p className="mt-4 text-red-500 text-xs font-sans border border-red-200 p-2 bg-red-50 dark:bg-red-900/10 rounded-md">{error}</p>
        )}

        {estimation && (
          <div className="mt-8 animate-fade-in">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xs font-bold uppercase text-black dark:text-white font-sans">
                Estimation Report ({currency})
              </h3>
              <button 
                onClick={handleCopy}
                className="flex items-center gap-1 text-xs font-sans uppercase font-bold hover:underline text-gray-500 hover:text-black dark:text-gray-400 dark:hover:text-white"
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
    </>
  );
};

export default CostEstimator;