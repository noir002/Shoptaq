import { useState } from 'react';
import {
  RiRobot2Line, RiFileTextLine, RiPriceTag3Line, RiMegaphoneLine,
  RiMoneyDollarCircleLine, RiLineChartLine, RiCopperCoinLine, RiCheckLine, RiStarLine
} from 'react-icons/ri';

import api from '../api/axios';
import toast from 'react-hot-toast';

const tools = [
  {
    id: 'description',
    title: 'Product Description',
    subtitle: 'AI-generated SEO copywriting',
    icon: RiFileTextLine,
    color: 'primary',
    fields: [
      { key: 'title', label: 'Product Title', placeholder: 'e.g. Wireless Noise-Cancelling Headphones', required: true },
      { key: 'category', label: 'Category', placeholder: 'e.g. Electronics', required: true },
      { key: 'tags', label: 'Tags (optional)', placeholder: 'e.g. wireless, audio, premium' },
    ],
    endpoint: '/ai/description',
    resultKey: 'description',
  },
  {
    id: 'tags',
    title: 'SEO Tag Generator',
    subtitle: 'Keyword-optimized product tags',
    icon: RiPriceTag3Line,
    color: 'green',
    fields: [
      { key: 'title', label: 'Product Title', placeholder: 'e.g. Yoga Mat Set', required: true },
      { key: 'category', label: 'Category', placeholder: 'e.g. Sports', required: true },
      { key: 'description', label: 'Description (optional)', placeholder: 'Brief product description...' },
    ],
    endpoint: '/ai/tags',
    resultKey: 'tags',
  },
  {
    id: 'caption',
    title: 'Marketing Captions',
    subtitle: 'Social media ready content',
    icon: RiMegaphoneLine,
    color: 'amber',
    fields: [
      { key: 'title', label: 'Product Title', placeholder: 'e.g. Smart Fitness Tracker', required: true },
      { key: 'category', label: 'Category', placeholder: 'e.g. Electronics', required: true },
      { key: 'price', label: 'Price ($)', placeholder: 'e.g. 89.99', type: 'number' },
    ],
    endpoint: '/ai/caption',
    resultKey: 'captions',
  },
  {
    id: 'pricing',
    title: 'Pricing Advisor',
    subtitle: 'Data-driven price recommendations',
    icon: RiMoneyDollarCircleLine,
    color: 'blue',
    fields: [
      { key: 'title', label: 'Product Title', placeholder: 'e.g. Leather Backpack', required: true },
      { key: 'category', label: 'Category', placeholder: 'e.g. Fashion', required: true },
      { key: 'currentPrice', label: 'Current Price ($)', placeholder: 'e.g. 149.99', type: 'number', required: true },
      { key: 'stock', label: 'Current Stock', placeholder: 'e.g. 45', type: 'number' },
    ],
    endpoint: '/ai/pricing',
    resultKey: 'recommendation',
  },
  {
    id: 'trending',
    title: 'Trending Products',
    subtitle: 'AI-spotted market opportunities',
    icon: RiLineChartLine,
    color: 'red',
    fields: [
      { key: 'category', label: 'Product Category', placeholder: 'e.g. Electronics', required: true },
    ],
    endpoint: '/ai/trending',
    resultKey: 'suggestions',
  },
];

const colorMap = {
  primary: { icon: 'text-primary-fixed-dim', bg: 'bg-primary-container/10', border: 'border-primary-container/20', active: 'border-primary-container/50 bg-primary-container/10' },
  green: { icon: 'text-secondary', bg: 'bg-secondary/10', border: 'border-secondary/20', active: 'border-secondary/50 bg-secondary/10' },
  amber: { icon: 'text-amber-400', bg: 'bg-amber-500/10', border: 'border-amber-500/20', active: 'border-amber-500/50 bg-amber-500/10' },
  blue: { icon: 'text-tertiary-fixed-dim', bg: 'bg-tertiary-container/10', border: 'border-tertiary-container/20', active: 'border-tertiary-container/50 bg-tertiary-container/10' },
  red: { icon: 'text-error', bg: 'bg-error-container/10', border: 'border-error-container/20', active: 'border-error-container/50 bg-error-container/10' },
};

const ResultDisplay = ({ tool, result }) => {
  const [copied, setCopied] = useState(false);

  const copyText = (text) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    toast.success('Copied to clipboard!');
    setTimeout(() => setCopied(false), 2000);
  };

  if (!result) return null;

  // Tags result
  if (tool.id === 'tags' && Array.isArray(result)) {
    return (
      <div className="mt-4 p-4 rounded-xl bg-white/5 border border-white/10 space-y-3 animate-fade-in relative overflow-hidden">
        <div className="noise-overlay opacity-15" />
        <div className="relative z-10">
          <div className="flex items-center justify-between mb-2">
            <p className="text-on-surface-variant text-xs font-semibold uppercase tracking-wider font-label-md">Generated Tags ({result.length})</p>
            <button onClick={() => copyText(result.join(', '))} className="text-xs text-primary-fixed-dim hover:text-primary flex items-center gap-1 font-label-md font-semibold">
              {copied ? <><RiCheckLine />Copied</> : 'Copy all'}
            </button>
          </div>
          <div className="flex flex-wrap gap-2">
            {result.map((tag, i) => (
              <span key={i} className="inline-block text-[11px] font-mono bg-primary-container/10 border border-primary-container/20 rounded-md px-2 py-0.5 text-primary-fixed-dim cursor-pointer hover:bg-primary-container/20 transition-colors" onClick={() => copyText(tag)}>
                #{tag}
              </span>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Captions result
  if (tool.id === 'caption' && typeof result === 'object') {
    return (
      <div className="mt-4 space-y-3 animate-fade-in">
        {Object.entries(result).map(([platform, caption]) => (
          <div key={platform} className="p-4 rounded-xl bg-white/5 border border-white/10 relative overflow-hidden">
            <div className="noise-overlay opacity-15" />
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-2">
                <span className="text-secondary text-xs font-bold uppercase tracking-wider font-label-md">{platform}</span>
                <button onClick={() => copyText(caption)} className="text-xs text-primary-fixed-dim hover:text-primary font-label-md font-semibold">Copy</button>
              </div>
              <p className="text-white/80 text-sm leading-relaxed font-body-md whitespace-pre-wrap">{caption}</p>
            </div>
          </div>
        ))}
      </div>
    );
  }

  // Pricing result
  if (tool.id === 'pricing' && typeof result === 'object') {
    return (
      <div className="mt-4 p-4 rounded-xl bg-white/5 border border-white/10 space-y-4 animate-fade-in relative overflow-hidden">
        <div className="noise-overlay opacity-15" />
        <div className="relative z-10 space-y-4">
          <div className="grid grid-cols-3 gap-3">
            {[
              { label: 'Min Price', value: `$${result.minPrice}`, color: 'text-secondary' },
              { label: 'Optimal Price', value: `$${result.optimalPrice}`, color: 'text-primary-fixed-dim' },
              { label: 'Max Price', value: `$${result.maxPrice}`, color: 'text-amber-400' },
            ].map(({ label, value, color }) => (
              <div key={label} className="text-center p-3 rounded-xl bg-white/5 border border-white/5">
                <p className="text-on-surface-variant text-[10px] font-semibold uppercase tracking-wider mb-1 font-label-sm">{label}</p>
                <p className={`font-bold text-lg font-mono ${color}`}>{value}</p>
              </div>
            ))}
          </div>
          {result.reasoning && <p className="text-white/70 text-sm leading-relaxed font-body-md">{result.reasoning}</p>}
          {result.suggestSale && (
            <div className="flex items-center gap-2.5 p-3 rounded-xl bg-amber-500/10 border border-amber-500/20">
              <RiCopperCoinLine className="text-amber-400 text-lg flex-shrink-0" />
              <p className="text-amber-300 text-sm font-body-md">Suggested discount: <strong className="font-mono">{result.discountPercent}%</strong> to move stock</p>
            </div>
          )}
        </div>
      </div>
    );
  }

  // Trending suggestions
  if (tool.id === 'trending' && Array.isArray(result)) {
    return (
      <div className="mt-4 space-y-3 animate-fade-in">
        {result.map((item, i) => (
          <div key={i} className="p-4 rounded-xl bg-white/5 border border-white/10 relative overflow-hidden">
            <div className="noise-overlay opacity-15" />
            <div className="relative z-10">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2 mb-1.5">
                    <span className="text-white/30 text-xs font-bold font-mono">#{i + 1}</span>
                    <p className="text-white font-semibold text-sm">{item.name}</p>
                  </div>
                  <p className="text-on-surface-variant text-xs leading-relaxed font-body-md">{item.reason}</p>
                </div>
                <div className="text-right flex-shrink-0">
                  <p className="text-secondary font-bold text-sm font-mono">{item.priceRange}</p>
                  <p className="text-white/30 text-[10px] font-mono mt-0.5">{item.targetAudience}</p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  // Default text result (description)
  const text = typeof result === 'string' ? result : JSON.stringify(result, null, 2);
  return (
    <div className="mt-4 p-4 rounded-xl bg-white/5 border border-white/10 animate-fade-in relative overflow-hidden">
      <div className="noise-overlay opacity-15" />
      <div className="relative z-10">
        <div className="flex items-center justify-between mb-3">
          <p className="text-on-surface-variant text-xs font-semibold uppercase tracking-wider font-label-md">Generated Content</p>
          <button onClick={() => copyText(text)} className="text-xs text-primary-fixed-dim hover:text-primary flex items-center gap-1 font-label-md font-semibold">
            {copied ? <><RiCheckLine />Copied</> : 'Copy'}
          </button>
        </div>
        <p className="text-white/80 text-sm leading-relaxed whitespace-pre-wrap font-body-md">{text}</p>
      </div>
    </div>
  );
};

const ToolCard = ({ tool }) => {
  const [fields, setFields] = useState({});
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [isMock, setIsMock] = useState(false);
  const c = colorMap[tool.color];

  const handleGenerate = async () => {
    const missing = tool.fields.filter((f) => f.required && !fields[f.key]);
    if (missing.length) return toast.error(`Please fill: ${missing.map((f) => f.label).join(', ')}`);
    setLoading(true);
    setResult(null);
    try {
      const { data } = await api.post(tool.endpoint, fields);
      setResult(data[tool.resultKey]);
      setIsMock(data.mock || false);
      toast.success('Generated successfully!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Generation failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card p-6 space-y-4 animate-fade-in relative overflow-hidden">
      <div className="noise-overlay opacity-20" />
      <div className="relative z-10 space-y-4">
        {/* Tool header */}
        <div className="flex items-start gap-3">
          <div className={`w-10 h-10 rounded-xl ${c.bg} border ${c.border} flex items-center justify-center flex-shrink-0`}>
            <tool.icon className={`${c.icon} text-lg`} />
          </div>
          <div>
            <h3 className="text-white font-bold font-headline-md">{tool.title}</h3>
            <p className="text-on-surface-variant text-xs font-body-md mt-0.5">{tool.subtitle}</p>
          </div>
        </div>

        {/* Fields */}
        <div className="space-y-3">
          {tool.fields.map((field) => (
            <div key={field.key}>
              <label className="block text-on-surface-variant text-xs font-semibold mb-1.5 uppercase tracking-wider font-label-md">
                {field.label} {field.required && <span className="text-primary-fixed-dim">*</span>}
              </label>
              <input
                type={field.type || 'text'}
                value={fields[field.key] || ''}
                onChange={(e) => setFields({ ...fields, [field.key]: e.target.value })}
                className="input py-2.5 text-sm"
                placeholder={field.placeholder}
              />
            </div>
          ))}
        </div>

        {/* Generate button */}
        <button
          onClick={handleGenerate}
          disabled={loading}
          className={`w-full flex items-center justify-center gap-2 h-11 rounded-xl font-semibold text-sm transition-all active:scale-98 shadow-md font-label-md
            ${loading ? 'bg-white/5 text-white/30 cursor-not-allowed border border-white/5' : 'btn-primary'}`}
        >
          {loading ? (
            <><div className="w-4 h-4 spinner" />Generating...</>
          ) : (
            <><RiStarLine className="animate-pulse" />Generate with AI</>
          )}
        </button>



        {/* Result */}
        <ResultDisplay tool={tool} result={result} />
      </div>
    </div>
  );
};

const AIGenerator = () => {
  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="w-11 h-11 rounded-xl bg-primary-container/15 border border-primary-container/25 flex items-center justify-center shadow-glow">
          <RiRobot2Line className="text-primary-fixed-dim text-xl" />
        </div>
        <div>
          <h2 className="text-white font-extrabold text-2xl tracking-tight font-headline-md">AI Command Center</h2>
          <p className="text-on-surface-variant text-sm mt-0.5 font-body-md">Generate descriptions, tags, captions, and pricing insights instantly</p>
        </div>
      </div>



      {/* Tools grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {tools.map((tool) => (
          <ToolCard key={tool.id} tool={tool} />
        ))}
      </div>
    </div>
  );
};

export default AIGenerator;
