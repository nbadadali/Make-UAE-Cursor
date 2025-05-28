
import "https://deno.land/x/xhr@0.1.0/mod.ts";
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
    const { query, filters = {}, topK = 10 } = await req.json();
    
    if (!query) {
      return new Response(JSON.stringify({ error: 'Query is required' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const openAIKey = Deno.env.get('OPENAI_API_KEY');
    const pineconeKey = Deno.env.get('PINECONE_API_KEY');
    
    if (!openAIKey || !pineconeKey) {
      throw new Error('Missing required API keys');
    }

    console.log('Searching for:', query);

    // Generate embedding for the search query
    const queryEmbedding = await generateQueryEmbedding(query, openAIKey);
    
    // Search in Pinecone
    const searchResults = await searchInPinecone(queryEmbedding, filters, topK, pineconeKey);
    
    // Format results
    const formattedResults = searchResults.matches?.map((match: any) => ({
      id: match.id,
      score: match.score,
      title: match.metadata.title,
      description: match.metadata.description,
      city: match.metadata.city,
      category: match.metadata.category,
      budget: match.metadata.budget,
      duration: match.metadata.duration,
      bestTime: match.metadata.bestTime,
      location: match.metadata.location,
      suitableFor: match.metadata.suitableFor,
      tips: match.metadata.tips
    })) || [];

    return new Response(JSON.stringify({
      query,
      results: formattedResults,
      totalResults: formattedResults.length
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in search-activities function:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});

async function generateQueryEmbedding(query: string, openAIKey: string): Promise<number[]> {
  const response = await fetch('https://api.openai.com/v1/embeddings', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${openAIKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'text-embedding-3-small',
      input: query,
    }),
  });

  const data = await response.json();
  return data.data[0].embedding;
}

async function searchInPinecone(embedding: number[], filters: any, topK: number, pineconeKey: string) {
  const body: any = {
    vector: embedding,
    topK,
    includeMetadata: true
  };

  if (Object.keys(filters).length > 0) {
    body.filter = filters;
  }

  const response = await fetch('https://make-uae-mvp-8w3f0s3.svc.aped-4627-b74a.pinecone.io/query', {
    method: 'POST',
    headers: {
      'Api-Key': pineconeKey,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  });

  return await response.json();
}
