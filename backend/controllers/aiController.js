const { GoogleGenerativeAI } = require('@google/generative-ai');
const {
  buildDescriptionPrompt,
  buildTagsPrompt,
  buildCaptionPrompt,
  buildPricingPrompt,
  buildTrendingPrompt,
} = require('../utils/aiPrompts');

// Safely normalize anything (string, array, undefined) into an array
const normalizeToArray = (val) => {
  if (Array.isArray(val)) return val;
  if (typeof val === 'string' && val.trim()) {
    return val.split(',').map((t) => t.trim()).filter(Boolean);
  }
  return [];
};

// Strip markdown code fences that Gemini sometimes wraps JSON in
const stripFences = (raw = '') =>
  raw.replace(/```json?\n?/gi, '').replace(/```/g, '').trim();

const getGeminiClient = () => {
  if (!process.env.GEMINI_API_KEY || process.env.GEMINI_API_KEY === 'your-gemini-api-key-here') {
    return null;
  }
  return new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
};

const callGemini = async (client, prompt) => {
  const model = client.getGenerativeModel({ model: 'gemini-3.5-flash' });
  const result = await model.generateContent(prompt);
  return result.response.text().trim();
};

// @desc    Generate product description
// @route   POST /api/ai/description
// @access  Private
const generateDescription = async (req, res) => {
  try {
    const { title, category, tags } = req.body;
    if (!title || !category) {
      return res.status(400).json({ message: 'Title and category are required' });
    }

    const client = getGeminiClient();
    if (!client) {
      return res.json({
        description: `The ${title} represents a considered addition to our ${category} assortment — engineered for discerning buyers who expect reliability, clarity of purpose, and lasting value. From materials selection through final inspection, every detail supports a premium retail experience.\n\nIdeal for both first-time purchasers and repeat clients, this listing balances performance with approachable pricing. Add ${title} to your cart today and experience the standard your customers expect.`,
        mock: true,
      });
    }

    // Normalize tags to array before passing to prompt builder
    const normalizedTags = normalizeToArray(tags);
    const prompt = buildDescriptionPrompt(title, category, normalizedTags);
    const description = await callGemini(client, prompt);
    res.json({ description });
  } catch (error) {
    console.error('Gemini error:', error.message);
    res.status(500).json({ message: 'AI generation failed: ' + error.message });
  }
};

// @desc    Generate SEO tags
// @route   POST /api/ai/tags
// @access  Private
const generateTags = async (req, res) => {
  try {
    const { title, category, description } = req.body;
    if (!title || !category) {
      return res.status(400).json({ message: 'Title and category are required' });
    }

    const client = getGeminiClient();
    if (!client) {
      const mockTags = [
        title.toLowerCase(),
        category.toLowerCase(),
        `best ${category}`,
        `${title} online`,
        `buy ${title}`,
        `premium ${category}`,
        `${title} deals`,
        `top ${category} products`,
      ];
      return res.json({ tags: mockTags, mock: true });
    }

    const prompt = buildTagsPrompt(title, category, description);
    const raw = await callGemini(client, prompt);

    let tags;
    try {
      const cleaned = stripFences(raw);
      const parsed = JSON.parse(cleaned);
      // Ensure we always have an array
      tags = Array.isArray(parsed) ? parsed : normalizeToArray(parsed);
    } catch {
      // Fallback: split comma-separated string
      tags = normalizeToArray((raw || '').replace(/['"[\]]/g, ''));
    }

    res.json({ tags });
  } catch (error) {
    console.error('Gemini error:', error.message);
    res.status(500).json({ message: 'AI generation failed: ' + error.message });
  }
};

// @desc    Generate marketing captions
// @route   POST /api/ai/caption
// @access  Private
const generateCaption = async (req, res) => {
  try {
    const { title, category, price } = req.body;
    if (!title || !category) {
      return res.status(400).json({ message: 'Title and category are required' });
    }

    const client = getGeminiClient();
    if (!client) {
      return res.json({
        captions: {
          instagram: `Now live: ${title}. A standout in ${category} — refined design, proven quality. ${price ? `From $${price}. ` : ''}Shop the collection · Link in bio.`,
          twitter: `New arrival — ${title}. Built for the ${category} buyer who values substance over hype. ${price ? `$${price} · ` : ''}Limited initial allocation.`,
          facebook: `We're pleased to add ${title} to our ${category} lineup. ${price ? `Retail price $${price}. ` : ''}Read the full specifications and order online today.`,
        },
        mock: true,
      });
    }

    const prompt = buildCaptionPrompt(title, category, price);
    const raw = await callGemini(client, prompt);

    let captions;
    try {
      captions = JSON.parse(stripFences(raw));
    } catch {
      captions = { instagram: raw, twitter: raw, facebook: raw };
    }
    res.json({ captions });
  } catch (error) {
    console.error('Gemini error:', error.message);
    res.status(500).json({ message: 'AI generation failed: ' + error.message });
  }
};

// @desc    Get pricing recommendation
// @route   POST /api/ai/pricing
// @access  Private
const recommendPrice = async (req, res) => {
  try {
    const { title, category, currentPrice, stock } = req.body;
    if (!title || !category || currentPrice === undefined) {
      return res.status(400).json({ message: 'Title, category, and currentPrice are required' });
    }

    const client = getGeminiClient();
    if (!client) {
      const min = (currentPrice * 0.85).toFixed(2);
      const max = (currentPrice * 1.25).toFixed(2);
      const optimal = (currentPrice * 1.05).toFixed(2);
      return res.json({
        recommendation: {
          minPrice: Number(min),
          maxPrice: Number(max),
          optimalPrice: Number(optimal),
          reasoning: `Comparable ${category} listings suggest modest upside without sacrificing conversion. A 5% adjustment aligns with category benchmarks while preserving perceived value for ${title}.`,
          suggestSale: stock > 50,
          discountPercent: stock > 50 ? 15 : 0,
        },
        mock: true,
      });
    }

    const prompt = buildPricingPrompt(title, category, currentPrice, stock);
    const raw = await callGemini(client, prompt);

    let recommendation;
    try {
      recommendation = JSON.parse(stripFences(raw));
    } catch {
      recommendation = { raw };
    }
    res.json({ recommendation });
  } catch (error) {
    console.error('Gemini error:', error.message);
    res.status(500).json({ message: 'AI generation failed: ' + error.message });
  }
};

// @desc    Get trending product suggestions
// @route   POST /api/ai/trending
// @access  Private
const getTrending = async (req, res) => {
  try {
    const { category, existingProducts } = req.body;
    if (!category) {
      return res.status(400).json({ message: 'Category is required' });
    }

    const client = getGeminiClient();
    if (!client) {
      return res.json({
        suggestions: [
          { name: `${category} Essentials Bundle`, reason: 'Curated starter sets reduce decision friction and lift average order value', priceRange: '$45–$120', targetAudience: 'First-time category buyers' },
          { name: `Refill & Subscribe ${category}`, reason: 'Replenishment models show strong retention in consumable adjacencies', priceRange: '$28–$65/mo', targetAudience: 'Household replenishment shoppers' },
          { name: `Pro-Series ${category}`, reason: 'Trade-up tier captures margin from enthusiasts willing to pay for specs', priceRange: '$150–$340', targetAudience: 'Serious hobbyists & professionals' },
          { name: `Limited ${category} Collaboration`, reason: 'Scarcity drops drive urgency and social sharing in seasonal windows', priceRange: '$75–$220', targetAudience: 'Brand-loyal collectors' },
          { name: `Compact ${category} Travel Line`, reason: 'Portable formats outperform in urban and commuter segments', priceRange: '$35–$95', targetAudience: 'Urban professionals 28–45' },
        ],
        mock: true,
      });
    }

    // Normalize existingProducts to array before passing
    const normalizedExisting = normalizeToArray(existingProducts);
    const prompt = buildTrendingPrompt(category, normalizedExisting);
    const raw = await callGemini(client, prompt);

    let suggestions;
    try {
      const parsed = JSON.parse(stripFences(raw));
      suggestions = Array.isArray(parsed) ? parsed : [];
    } catch {
      suggestions = [];
    }
    res.json({ suggestions });
  } catch (error) {
    console.error('Gemini error:', error.message);
    res.status(500).json({ message: 'AI generation failed: ' + error.message });
  }
};

module.exports = { generateDescription, generateTags, generateCaption, recommendPrice, getTrending };
