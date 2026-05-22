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
        description: `Introducing the ${title} — a premium ${category} product designed for those who demand quality and performance. Crafted with precision and built to last, this product combines cutting-edge technology with elegant design. Whether you're a seasoned professional or just starting out, ${title} delivers exceptional value at every turn.\n\nExperience the difference that quality makes. Shop now and elevate your everyday experience.`,
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
          instagram: `✨ Introducing ${title}! The ${category} upgrade you've been waiting for. 🛒 Shop now! #${category.replace(/\s+/g, '')} #NewArrival #ShopNow`,
          twitter: `🚀 Just dropped: ${title} — the ${category} that changes everything. Limited stock. Don't miss out! 👉`,
          facebook: `We're excited to introduce ${title}! ${price ? `Starting at just $${price}, ` : ''}this is the deal you've been waiting for. Click to grab yours today!`,
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
          reasoning: `Based on current market trends for ${category} products, a slight price increase of 5% is recommended. Your current pricing is competitive but there's room to optimize margins while staying attractive to buyers.`,
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
          { name: `Smart ${category} Pro`, reason: 'AI-integrated features driving massive demand in 2025', priceRange: '$49-$199', targetAudience: 'Tech-savvy millennials' },
          { name: `Eco ${category} Bundle`, reason: 'Sustainability trend dominates consumer choices', priceRange: '$29-$89', targetAudience: 'Eco-conscious buyers 25-40' },
          { name: `${category} Starter Kit`, reason: 'Beginners market expanding rapidly with how-to content', priceRange: '$19-$59', targetAudience: 'Beginners and students' },
          { name: `Premium ${category} Set`, reason: 'Luxury positioning seeing 40% YoY growth', priceRange: '$99-$299', targetAudience: 'Affluent professionals 30-55' },
          { name: `Mini ${category} Edition`, reason: 'Compact and portable products trending across all categories', priceRange: '$15-$49', targetAudience: 'Mobile-first Gen Z shoppers' },
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
