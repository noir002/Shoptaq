import { useState } from 'react';
import {
  RiSparkling2Line, RiFileTextLine, RiPriceTag3Line, RiMegaphoneLine,
  RiMoneyDollarCircleLine, RiLineChartLine, RiCopperCoinLine, RiCheckLine,
} from 'react-icons/ri';
import api from '../api/axios';
import toast from 'react-hot-toast';
import PageHeader from '../components/ui/PageHeader';
import { CATEGORIES } from '../constants/catalog';

const tools = [
  {
    id: 'description',
    title: 'Listing copywriter',
    subtitle: 'SEO-ready product narratives for PDPs',
    icon: RiFileTextLine,
    color: 'primary',
    fields: [
      { key: 'title', label: 'Product name', placeholder: 'e.g. Atlas Merino Quarter-Zip', required: true },
      { key: 'category', label: 'Department', placeholder: 'e.g. Apparel & Accessories', required: true },
      { key: 'tags', label: 'Keywords (optional)', placeholder: 'merino, layering, winter-2025' },
    ],
    endpoint: '/ai/description',
    resultKey: 'description',
  },
  {
    id: 'tags',
    title: 'Search taxonomy',
    subtitle: 'Discoverability tags for filters & search',
    icon: RiPriceTag3Line,
    color: 'green',
    fields: [
      { key: 'title', label: 'Product name', placeholder: 'e.g. Summit Cold Brew Kit', required: true },
      { key: 'category', label: 'Department', placeholder: 'e.g. Gourmet & Pantry', required: true },
      { key: 'description', label: 'Existing copy (optional)', placeholder: 'Short product summary…' },
    ],
    endpoint: '/ai/tags',
    resultKey: 'tags',
  },
  {
    id: 'caption',
    title: 'Campaign messaging',
    subtitle: 'Channel-specific promotional copy',
    icon: RiMegaphoneLine,
    color: 'amber',
    fields: [
      { key: 'title', label: 'Product name', placeholder: 'e.g. Horizon Smart Scale', required: true },
      { key: 'category', label: 'Department', placeholder: 'e.g. Health & Wellness', required: true },
      { key: 'price', label: 'Retail price ($)', placeholder: 'e.g. 124.00', type: 'number' },
    ],
    endpoint: '/ai/caption',
    resultKey: 'captions',
  },
  {
    id: 'pricing',
    title: 'Margin optimizer',
    subtitle: 'Competitive price band recommendations',
    icon: RiMoneyDollarCircleLine,
    color: 'blue',
    fields: [
      { key: 'title', label: 'Product name', placeholder: 'e.g. Executive Leather Portfolio', required: true },
      { key: 'category', label: 'Department', placeholder: 'e.g. Office & Workspace', required: true },
      { key: 'currentPrice', label: 'Current retail ($)', placeholder: 'e.g. 189.00', type: 'number', required: true },
      { key: 'stock', label: 'Units on hand', placeholder: 'e.g. 42', type: 'number' },
    ],
    endpoint: '/ai/pricing',
    resultKey: 'recommendation',
  },
  {
    id: 'trending',
    title: 'Assortment radar',
    subtitle: 'Emerging categories & demand signals',
    icon: RiLineChartLine,
    color: 'red',
    fields: [
      { key: 'category', label: 'Target department', placeholder: 'e.g. Tech & Gadgets', required: true },
    ],
    endpoint: '/ai/trending',
    resultKey: 'suggestions',
  },
];

const colorMap = {
  primary: { icon: 'text-primary-fixed-dim', bg: 'bg-primary-container/10', border: 'border-primary-container/20', active: 'border-primary/40 bg-primary-container/10' },
  green: { icon: 'text-secondary', bg: 'bg-secondary/10', border: 'border-secondary/20', active: 'border-secondary/40 bg-secondary/10' },
  amber: { icon: 'text-amber-600', bg: 'bg-amber-50', border: 'border-amber-200', active: 'border-amber-300 bg-amber-50' },
  blue: { icon: 'text-orange-700', bg: 'bg-orange-50', border: 'border-orange-200', active: 'border-orange-300 bg-orange-50' },
  red: { icon: 'text-red-600', bg: 'bg-red-50', border: 'border-red-200', active: 'border-red-300 bg-red-50' },
};

const ResultDisplay = ({ tool, result }) => {
  const [copied, setCopied] = useState(false);
  const copyText = (text) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    toast.success('Copied');
    setTimeout(() => setCopied(false), 2000);
  };

  if (!result) return null;

  if (tool.id === 'tags' && Array.isArray(result)) {
    return (
      <div className="mt-4 p-4 rounded-xl neo-inset space-y-3 animate-fade-in">
        <div className="flex items-center justify-between">
          <p className="text-on-surface-variant text-xs font-semibold uppercase tracking-wider">Taxonomy ({result.length})</p>
          <button type="button" onClick={() => copyText(result.join(', '))} className="text-xs text-primary font-semibold">
            {copied ? 'Copied' : 'Copy all'}
          </button>
        </div>
        <div className="flex flex-wrap gap-2">
          {result.map((tag, i) => (
            <span key={i} className="text-[11px] font-mono bg-primary-container/10 border border-primary-container/20 rounded-md px-2 py-0.5 text-primary-fixed-dim cursor-pointer" onClick={() => copyText(tag)}>
              {tag}
            </span>
          ))}
        </div>
      </div>
    );
  }

  if (tool.id === 'caption' && typeof result === 'object') {
    return (
      <div className="mt-4 space-y-3 animate-fade-in">
        {Object.entries(result).map(([platform, caption]) => (
          <div key={platform} className="p-4 rounded-xl border border-outline/50 bg-surface-raised">
            <div className="flex items-center justify-between mb-2">
              <span className="text-secondary text-xs font-bold uppercase tracking-wider">{platform}</span>
              <button type="button" onClick={() => copyText(caption)} className="text-xs text-primary font-semibold">Copy</button>
            </div>
            <p className="text-on-surface text-sm leading-relaxed whitespace-pre-wrap">{caption}</p>
          </div>
        ))}
      </div>
    );
  }

  if (tool.id === 'pricing' && typeof result === 'object') {
    return (
      <div className="mt-4 p-4 rounded-xl neo-inset space-y-4 animate-fade-in">
        <div className="grid grid-cols-3 gap-3">
          {[
            { label: 'Floor', value: `$${result.minPrice}`, color: 'text-secondary' },
            { label: 'Recommended', value: `$${result.optimalPrice}`, color: 'text-primary-fixed-dim' },
            { label: 'Ceiling', value: `$${result.maxPrice}`, color: 'text-amber-600' },
          ].map(({ label, value, color }) => (
            <div key={label} className="text-center p-3 rounded-xl bg-surface-raised border border-outline/40">
              <p className="text-on-surface-variant text-[10px] uppercase tracking-wider mb-1">{label}</p>
              <p className={`font-bold text-lg font-mono ${color}`}>{value}</p>
            </div>
          ))}
        </div>
        {result.reasoning && <p className="text-on-surface-variant text-sm leading-relaxed">{result.reasoning}</p>}
        {result.suggestSale && (
          <div className="flex items-center gap-2 p-3 rounded-xl bg-amber-50 border border-amber-200">
            <RiCopperCoinLine className="text-amber-600" />
            <p className="text-amber-800 text-sm">Promotional markdown: <strong>{result.discountPercent}%</strong> suggested to accelerate sell-through</p>
          </div>
        )}
      </div>
    );
  }

  if (tool.id === 'trending' && Array.isArray(result)) {
    return (
      <div className="mt-4 space-y-3 animate-fade-in">
        {result.map((item, i) => (
          <div key={i} className="data-row flex-col sm:flex-row sm:items-start !items-start gap-3">
            <span className="sku-mono">OP-{String(i + 1).padStart(2, '0')}</span>
            <div className="flex-1">
              <p className="text-on-surface font-semibold text-sm">{item.name}</p>
              <p className="text-on-surface-variant text-xs mt-1 leading-relaxed">{item.reason}</p>
            </div>
            <div className="text-right sm:text-right w-full sm:w-auto">
              <p className="text-secondary font-mono text-sm font-semibold">{item.priceRange}</p>
              <p className="text-on-surface-variant text-[10px] mt-0.5">{item.targetAudience}</p>
            </div>
          </div>
        ))}
      </div>
    );
  }

  const text = typeof result === 'string' ? result : JSON.stringify(result, null, 2);
  return (
    <div className="mt-4 p-4 rounded-xl neo-inset animate-fade-in">
      <div className="flex items-center justify-between mb-3">
        <p className="text-on-surface-variant text-xs font-semibold uppercase tracking-wider">Output</p>
        <button type="button" onClick={() => copyText(text)} className="text-xs text-primary font-semibold flex items-center gap-1">
          {copied ? <><RiCheckLine /> Copied</> : 'Copy'}
        </button>
      </div>
      <p className="text-on-surface text-sm leading-relaxed whitespace-pre-wrap">{text}</p>
    </div>
  );
};

const AIGenerator = () => {
  const [activeId, setActiveId] = useState(tools[0].id);
  const activeTool = tools.find((t) => t.id === activeId);
  const [fields, setFields] = useState({});
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const c = colorMap[activeTool.color];

  const handleGenerate = async () => {
    const missing = activeTool.fields.filter((f) => f.required && !fields[f.key]);
    if (missing.length) return toast.error(`Complete: ${missing.map((f) => f.label).join(', ')}`);
    setLoading(true);
    setResult(null);
    try {
      const { data } = await api.post(activeTool.endpoint, fields);
      setResult(data[activeTool.resultKey]);
      toast.success('Generation complete');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Generation failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <PageHeader
        badge="Merchandising Studio"
        title="AI-assisted retail workflows"
        subtitle="Produce listing copy, search taxonomies, campaign assets, and pricing guidance powered by Gemini."
      />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-4 space-y-2">
          {tools.map((tool) => {
            const tc = colorMap[tool.color];
            const isActive = tool.id === activeId;
            return (
              <button
                key={tool.id}
                type="button"
                onClick={() => { setActiveId(tool.id); setFields({}); setResult(null); }}
                className={`w-full text-left p-4 rounded-xl border transition-all ${
                  isActive ? `${tc.active} shadow-neo-sm` : 'border-outline/40 bg-surface-raised hover:border-primary/20'
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className={`w-9 h-9 rounded-lg ${tc.bg} border ${tc.border} flex items-center justify-center flex-shrink-0`}>
                    <tool.icon className={`${tc.icon} text-lg`} />
                  </div>
                  <div>
                    <p className="text-on-surface font-semibold text-sm">{tool.title}</p>
                    <p className="text-on-surface-variant text-xs mt-0.5">{tool.subtitle}</p>
                  </div>
                </div>
              </button>
            );
          })}
          <div className="card p-4 mt-4">
            <p className="text-on-surface-variant text-xs leading-relaxed">
              <RiSparkling2Line className="inline text-primary mr-1" />
              Tip: use departments like {CATEGORIES.slice(0, 2).join(' or ')} for best results.
            </p>
          </div>
        </div>

        <div className="lg:col-span-8 section-panel">
          <div className="section-panel__head">
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-xl ${c.bg} border ${c.border} flex items-center justify-center`}>
                <activeTool.icon className={`${c.icon} text-lg`} />
              </div>
              <div>
                <h3 className="text-on-surface font-semibold">{activeTool.title}</h3>
                <p className="text-on-surface-variant text-xs">{activeTool.subtitle}</p>
              </div>
            </div>
          </div>
          <div className="section-panel__body space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {activeTool.fields.map((field) => (
                <div key={field.key} className={activeTool.fields.length === 1 || field.key === 'description' ? 'sm:col-span-2' : ''}>
                  <label className="block text-on-surface-variant text-xs font-semibold mb-1.5 uppercase tracking-wider">
                    {field.label} {field.required && <span className="text-primary">*</span>}
                  </label>
                  {field.key === 'category' ? (
                    <select
                      value={fields[field.key] || ''}
                      onChange={(e) => setFields({ ...fields, [field.key]: e.target.value })}
                      className="input h-[46px] py-0 px-3"
                    >
                      <option value="">Select department</option>
                      {CATEGORIES.map((cat) => <option key={cat} value={cat}>{cat}</option>)}
                    </select>
                  ) : (
                    <input
                      type={field.type || 'text'}
                      value={fields[field.key] || ''}
                      onChange={(e) => setFields({ ...fields, [field.key]: e.target.value })}
                      className="input py-2.5 text-sm"
                      placeholder={field.placeholder}
                    />
                  )}
                </div>
              ))}
            </div>

            <button
              type="button"
              onClick={handleGenerate}
              disabled={loading}
              className={`w-full flex items-center justify-center gap-2 h-11 rounded-xl font-semibold text-sm ${loading ? 'neo-inset text-on-surface-variant' : 'btn-primary'}`}
            >
              {loading ? <><div className="w-4 h-4 spinner" /> Processing…</> : <><RiSparkling2Line /> Run workflow</>}
            </button>

            <ResultDisplay tool={activeTool} result={result} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIGenerator;
