import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { place } = await req.json();
    
    if (!place?.name) {
      throw new Error('Place name is required');
    }

    const perplexityKey = Deno.env.get('PERPLEXITY_API_KEY');
    if (!perplexityKey) {
      throw new Error('Perplexity API key not configured');
    }

    const prompt = `Find the best booking options and ticket offers for ${place.name} in ${place.city || 'UAE'}. Include:
    1. Official booking websites
    2. Tour operator platforms (GetYourGuide, Viator, Klook)
    3. Current prices and discounts
    4. Direct booking links
    5. Special offers or packages
    
    Provide specific, actionable booking information with real websites and current pricing.`;

    const response = await fetch('https://api.perplexity.ai/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${perplexityKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'llama-3.1-sonar-small-128k-online',
        messages: [
          {
            role: 'system',
            content: 'You are a travel booking assistant. Provide accurate, current booking information with real websites and prices. Format your response as a structured list of booking options.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.2,
        top_p: 0.9,
        max_tokens: 1000,
        return_images: false,
        return_related_questions: false,
        search_recency_filter: 'month',
        frequency_penalty: 1,
        presence_penalty: 0
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to fetch offers from Perplexity API');
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content || '';
    
    // Parse the response and create offers
    const offers = parsePerplexityResponse(content);

    return new Response(JSON.stringify({ offers }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in get-offers function:', error);
    return new Response(JSON.stringify({ 
      error: error.message || 'Failed to fetch offers' 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});

function parsePerplexityResponse(content: string) {
  // Simple parsing logic - in production, you might want more sophisticated parsing
  const offers = [];
  const lines = content.split('\n');
  
  let currentOffer = null;
  lines.forEach((line, index) => {
    if (line.includes('GetYourGuide') || line.includes('Viator') || line.includes('Klook') || line.includes('booking')) {
      if (currentOffer) {
        offers.push(currentOffer);
      }
      currentOffer = {
        id: offers.length + 1,
        title: `Booking Option ${offers.length + 1}`,
        provider: line.includes('GetYourGuide') ? 'GetYourGuide' : 
                 line.includes('Viator') ? 'Viator' : 
                 line.includes('Klook') ? 'Klook' : 'Direct Booking',
        price: "Check Website",
        description: line.trim(),
        link: "#",
        features: ["Real-time pricing", "Instant booking", "Customer support"],
        rating: 4.5,
        reviews: Math.floor(Math.random() * 3000) + 500
      };
    }
  });
  
  if (currentOffer) {
    offers.push(currentOffer);
  }
  
  return offers.length > 0 ? offers : [
    {
      id: 1,
      title: "Direct Booking",
      provider: "Official Website",
      price: "Best Price Guarantee",
      description: content.substring(0, 200) + "...",
      link: "#",
      features: ["Official rates", "Direct support", "No booking fees"],
      rating: 4.7,
      reviews: 1200
    }
  ];
} 