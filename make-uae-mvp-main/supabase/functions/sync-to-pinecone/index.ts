import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.38.0';
import { encode } from "https://deno.land/std@0.168.0/encoding/base64.ts";

const PINECONE_API_KEY = Deno.env.get('PINECONE_API_KEY') || '';
const OPENAI_API_KEY = Deno.env.get('OPENAI_API_KEY') || '';
const SUPABASE_URL = Deno.env.get('SUPABASE_URL') || '';
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || '';

// Initialize Supabase client
const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

// Function to get embeddings from OpenAI
async function getEmbeddings(text: string): Promise<number[]> {
  const response = await fetch('https://api.openai.com/v1/embeddings', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${OPENAI_API_KEY}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      input: text,
      model: "text-embedding-ada-002"
    })
  });

  const data = await response.json();
  return data.data[0].embedding;
}

// Function to upsert vectors to Pinecone
async function upsertToPinecone(vectors: any[]) {
  const response = await fetch('https://make-uae-cursor-w5h5ft3.svc.aped-4627-b74a.pinecone.io/vectors/upsert', {
    method: 'POST',
    headers: {
      'Api-Key': PINECONE_API_KEY,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ vectors })
  });

  return response.ok;
}

// Function to delete vectors from Pinecone
async function deleteFromPinecone(ids: string[]) {
  const response = await fetch('https://make-uae-cursor-w5h5ft3.svc.aped-4627-b74a.pinecone.io/vectors/delete', {
    method: 'POST',
    headers: {
      'Api-Key': PINECONE_API_KEY,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ ids })
  });

  return response.ok;
}

// Function to prepare city data for embedding
function prepareCityData(city: any): string {
  return `City: ${city.name}
Description: ${city.description || ''}
Best For: ${city.best_for?.join(', ') || ''}
Airport: ${city.airport || ''}
Key Areas: ${city.key_areas?.join(', ') || ''}`;
}

// Function to prepare activity data for embedding
function prepareActivityData(activity: any): string {
  return `Activity: ${activity.title}
Description: ${activity.description || ''}
City: ${activity.city_id || ''}
Category: ${activity.category || ''}
Budget: ${activity.budget || ''}
Duration: ${activity.duration || ''}
Best Time: ${activity.best_time || ''}
Location: ${activity.location || ''}
Suitable For: ${activity.suitable_for || ''}
Tips: ${activity.tips || ''}`;
}

serve(async (req) => {
  try {
    const { type, table, record, old_record } = await req.json();

    // Handle webhook events
    if (type && table) {
      let success = false;

      switch (type) {
        case 'INSERT':
        case 'UPDATE': {
          const text = table === 'cities' ? prepareCityData(record) : prepareActivityData(record);
          const embedding = await getEmbeddings(text);
          const vector = {
            id: record.id,
            values: embedding,
            metadata: {
              type: table,
              ...record
            }
          };
          success = await upsertToPinecone([vector]);
          break;
        }
        case 'DELETE': {
          success = await deleteFromPinecone([old_record.id]);
          break;
        }
      }

      return new Response(JSON.stringify({
        success,
        message: `Successfully processed ${type} event for ${table}`,
        record: record || old_record
      }), {
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Handle manual sync request
    const { data: cities } = await supabase.from('cities').select('*');
    const { data: activities } = await supabase.from('activities').select('*');

    const vectors = [];
    let successCount = 0;
    let errorCount = 0;
    const syncResults = [];

    // Process cities
    if (cities) {
      for (const city of cities) {
        try {
          const text = prepareCityData(city);
          const embedding = await getEmbeddings(text);
          vectors.push({
            id: city.id,
            values: embedding,
            metadata: {
              type: 'cities',
              ...city
            }
          });
          successCount++;
          syncResults.push({ id: city.id, success: true });
        } catch (error) {
          errorCount++;
          syncResults.push({ id: city.id, success: false, error: error.message });
        }
      }
    }

    // Process activities
    if (activities) {
      for (const activity of activities) {
        try {
          const text = prepareActivityData(activity);
          const embedding = await getEmbeddings(text);
          vectors.push({
            id: activity.id,
            values: embedding,
            metadata: {
              type: 'activities',
              ...activity
            }
          });
          successCount++;
          syncResults.push({ id: activity.id, success: true });
        } catch (error) {
          errorCount++;
          syncResults.push({ id: activity.id, success: false, error: error.message });
        }
      }
    }

    // Upsert all vectors to Pinecone
    const success = await upsertToPinecone(vectors);

    return new Response(JSON.stringify({
      success,
      message: `Successfully synced ${successCount} items to Pinecone index 'make-uae-cursor'`,
      totalItems: (cities?.length || 0) + (activities?.length || 0),
      successCount,
      errorCount,
      syncResults
    }), {
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error) {
    return new Response(JSON.stringify({
      success: false,
      error: error.message
    }), {
      headers: { 'Content-Type': 'application/json' },
      status: 500
    });
  }
});
