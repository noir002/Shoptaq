/**
 * Reusable AI prompt builder functions for Sage AI
 */

// Safely convert anything (string, array, undefined) to an array
const normalizeToArray = (val) => {
  if (Array.isArray(val)) return val;
  if (typeof val === 'string' && val.trim()) {
    return val.split(',').map((t) => t.trim()).filter(Boolean);
  }
  return [];
};

const buildDescriptionPrompt = (title, category, tags = []) => {
  const tagList = normalizeToArray(tags);
  return `You are an expert ecommerce copywriter. Write a compelling, SEO-optimized product description for:

Product: ${title}
Category: ${category}
Tags: ${tagList.join(', ')}

Requirements:
- 2-3 paragraphs, engaging and persuasive
- Highlight key benefits and features
- Include a subtle call-to-action
- Keep it under 200 words
- Tone: professional yet friendly

Return only the description text, no extra labels.`;
};

const buildTagsPrompt = (title, category, description = '') => {
  return `You are an SEO specialist. Generate exactly 8 SEO-optimized tags/keywords for this product:

Product: ${title}
Category: ${category}
Description: ${description.slice(0, 200)}

Requirements:
- Mix of short-tail and long-tail keywords
- High commercial intent
- Relevant to the product
- No duplicate tags

Return ONLY a JSON array of strings, e.g. ["tag1", "tag2", ...]`;
};

const buildCaptionPrompt = (title, category, price) => {
  return `You are a social media marketing expert. Create 3 different marketing captions for:

Product: ${title}
Category: ${category}
Price: $${price}

Create one caption for each platform:
1. Instagram (engaging, emoji-rich, 150 chars max)
2. Twitter/X (punchy, 280 chars max)
3. Facebook (conversational, 200 chars max)

Return as JSON: {"instagram": "...", "twitter": "...", "facebook": "..."}`;
};

const buildPricingPrompt = (title, category, currentPrice, stock) => {
  return `You are a pricing strategy expert. Analyze and recommend pricing for:

Product: ${title}
Category: ${category}
Current Price: $${currentPrice}
Current Stock: ${stock} units

Provide:
1. Recommended price range (min-max)
2. Optimal price point
3. Brief reasoning (2-3 sentences)
4. Whether to run a sale and at what discount %

Return as JSON: {
  "minPrice": number,
  "maxPrice": number,
  "optimalPrice": number,
  "reasoning": "string",
  "suggestSale": boolean,
  "discountPercent": number
}`;
};

const buildTrendingPrompt = (category, existingProducts = []) => {
  return `You are a product trend analyst with deep knowledge of ecommerce markets. 

Existing products in ${category} category: ${normalizeToArray(existingProducts).slice(0, 5).join(', ')}

Suggest 5 trending product ideas for the ${category} category that would sell well right now in 2024-2025.

For each product provide:
- Product name
- Why it's trending (1 sentence)
- Estimated price range
- Target audience

Return as JSON array: [
  {
    "name": "string",
    "reason": "string", 
    "priceRange": "string",
    "targetAudience": "string"
  }
]`;
};

module.exports = {
  buildDescriptionPrompt,
  buildTagsPrompt,
  buildCaptionPrompt,
  buildPricingPrompt,
  buildTrendingPrompt,
};
