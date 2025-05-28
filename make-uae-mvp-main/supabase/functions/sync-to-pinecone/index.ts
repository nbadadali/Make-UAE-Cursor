
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface Activity {
  id: string;
  title: string;
  description: string;
  city: string;
  category: string;
  budget: string;
  duration: string;
  bestTime: string;
  location: string;
  suitableFor: string;
  tips?: string;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const openAIKey = Deno.env.get('OPENAI_API_KEY');
    const pineconeKey = Deno.env.get('PINECONE_API_KEY');
    
    if (!openAIKey || !pineconeKey) {
      throw new Error('Missing required API keys: OPENAI_API_KEY or PINECONE_API_KEY');
    }

    console.log('Starting programmatic sync of UAE travel database to Pinecone index make-uae-mvp...');

    // Load complete travel database from your documentation
    const activities = await loadCompleteUAETravelDatabase();
    console.log(`Loaded ${activities.length} activities from UAE travel database`);

    // Batch sync to Pinecone
    const batchSize = 10;
    const syncResults = [];
    
    for (let i = 0; i < activities.length; i += batchSize) {
      const batch = activities.slice(i, i + batchSize);
      const batchPromises = batch.map(async (activity) => {
        try {
          const embedding = await generateEmbedding(activity, openAIKey);
          return await syncToPinecone(activity, embedding, pineconeKey);
        } catch (error) {
          console.error(`Failed to sync activity ${activity.title}:`, error);
          return { error: error.message, activityId: activity.id };
        }
      });
      
      const batchResults = await Promise.all(batchPromises);
      syncResults.push(...batchResults);
      console.log(`Synced batch ${Math.floor(i/batchSize) + 1}/${Math.ceil(activities.length/batchSize)}`);
    }

    const successCount = syncResults.filter(r => !r.error).length;
    const errorCount = syncResults.filter(r => r.error).length;

    return new Response(JSON.stringify({
      success: true,
      message: `Programmatically synced ${successCount} activities to Pinecone index 'make-uae-mvp'`,
      totalActivities: activities.length,
      successCount,
      errorCount,
      pineconeIndex: 'make-uae-mvp',
      results: syncResults
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in programmatic sync to Pinecone:', error);
    return new Response(JSON.stringify({ 
      error: error.message,
      pineconeIndex: 'make-uae-mvp'
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});

async function loadCompleteUAETravelDatabase(): Promise<Activity[]> {
  return [
    // DUBAI - Top Tourist Destinations
    {
      id: 'dubai_burj_khalifa',
      title: 'Burj Khalifa & Dubai Mall',
      description: 'Visit the world\'s tallest building and explore the largest mall in Dubai. Experience breathtaking views from the observation deck and enjoy world-class shopping and dining.',
      city: 'Dubai',
      category: 'Architecture',
      budget: '$$',
      duration: '4 hours',
      bestTime: 'Evening for sunset views',
      location: 'Downtown Dubai',
      suitableFor: 'All ages, families, couples, solo travelers',
      tips: 'Book observation deck tickets in advance for better prices'
    },
    {
      id: 'dubai_desert_safari',
      title: 'Desert Safari Adventure',
      description: 'Experience dune bashing, camel riding, and traditional Bedouin dinner under the stars. Includes sandboarding, henna painting, and cultural performances.',
      city: 'Dubai',
      category: 'Adventure',
      budget: '$$$',
      duration: '6 hours',
      bestTime: 'Afternoon to evening',
      location: 'Dubai Desert Conservation Reserve',
      suitableFor: 'Adventure seekers, families (children 3+)',
      tips: 'Wear comfortable clothes and bring sunglasses'
    },
    {
      id: 'dubai_burj_al_arab',
      title: 'Burj Al Arab',
      description: 'Marvel at the world\'s most luxurious hotel, shaped like a billowing sail. Enjoy afternoon tea or dinner at this architectural masterpiece.',
      city: 'Dubai',
      category: 'Architecture',
      budget: '$$$',
      duration: '2 hours',
      bestTime: 'Sunset for best photos',
      location: 'Jumeirah Beach',
      suitableFor: 'Luxury seekers, couples, architecture enthusiasts',
      tips: 'Reservations required for dining experiences'
    },
    {
      id: 'dubai_marina_jbr',
      title: 'Dubai Marina & JBR Beach',
      description: 'Stroll along the beautiful marina promenade, enjoy beach activities at Jumeirah Beach Residence, and experience waterfront dining.',
      city: 'Dubai',
      category: 'Nature',
      budget: '$$',
      duration: '4 hours',
      bestTime: 'Morning or evening',
      location: 'Dubai Marina',
      suitableFor: 'Beach lovers, families, relaxation seekers',
      tips: 'Bring sunscreen, many free beach activities available'
    },
    {
      id: 'dubai_gold_spice_souks',
      title: 'Gold & Spice Souks',
      description: 'Explore traditional markets in Old Dubai, discover authentic spices, gold jewelry, and experience the heritage culture.',
      city: 'Dubai',
      category: 'Culture',
      budget: '$',
      duration: '2 hours',
      bestTime: 'Evening when cooler',
      location: 'Deira, Old Dubai',
      suitableFor: 'Culture enthusiasts, shoppers, heritage lovers',
      tips: 'Bargaining expected, take abra across Dubai Creek'
    },

    // ABU DHABI - Cultural & Modern Attractions
    {
      id: 'abudhabi_sheikh_zayed_mosque',
      title: 'Sheikh Zayed Grand Mosque',
      description: 'Marvel at one of the world\'s most beautiful mosques with stunning white marble architecture and intricate Islamic art.',
      city: 'Abu Dhabi',
      category: 'Architecture',
      budget: '$',
      duration: '3 hours',
      bestTime: 'Early morning or late afternoon',
      location: 'Abu Dhabi',
      suitableFor: 'All ages, cultural enthusiasts',
      tips: 'Dress modestly, free guided tours available'
    },
    {
      id: 'abudhabi_ferrari_world',
      title: 'Ferrari World Abu Dhabi',
      description: 'Indoor theme park with world\'s fastest roller coaster, Formula 1 simulators, and family rides celebrating Ferrari legacy.',
      city: 'Abu Dhabi',
      category: 'Family',
      budget: '$$$',
      duration: '6 hours',
      bestTime: 'Weekdays for shorter queues',
      location: 'Yas Island',
      suitableFor: 'Families with children 6+, car enthusiasts',
      tips: 'Height restrictions on some rides, fast-pass available'
    },
    {
      id: 'abudhabi_louvre',
      title: 'Louvre Abu Dhabi',
      description: 'World-class art museum featuring masterpieces from ancient to contemporary art, housed under a stunning geometric dome.',
      city: 'Abu Dhabi',
      category: 'Culture',
      budget: '$$',
      duration: '3 hours',
      bestTime: 'Morning or afternoon',
      location: 'Saadiyat Island',
      suitableFor: 'Art lovers, families, cultural enthusiasts',
      tips: 'Audio guides available, photography allowed in most areas'
    },
    {
      id: 'abudhabi_yas_waterworld',
      title: 'Yas Waterworld',
      description: 'Massive waterpark with over 40 rides including the world\'s first hydro-magnetic tornado waterslide.',
      city: 'Abu Dhabi',
      category: 'Family',
      budget: '$$',
      duration: '6 hours',
      bestTime: 'Weekdays, morning arrival',
      location: 'Yas Island',
      suitableFor: 'Families, water sports enthusiasts',
      tips: 'Bring sun protection, lockers available'
    },

    // SHARJAH - Cultural Heritage
    {
      id: 'sharjah_islamic_museum',
      title: 'Sharjah Museum of Islamic Civilization',
      description: 'Comprehensive collection of Islamic art, artifacts, and manuscripts spanning 1,400 years of Islamic heritage.',
      city: 'Sharjah',
      category: 'Culture',
      budget: '$',
      duration: '2 hours',
      bestTime: 'Morning or afternoon',
      location: 'Sharjah Heritage Area',
      suitableFor: 'History enthusiasts, families, students',
      tips: 'Photography allowed, guided tours available'
    },
    {
      id: 'sharjah_al_noor_mosque',
      title: 'Al Noor Mosque',
      description: 'Beautiful mosque open to non-Muslim visitors with stunning Ottoman architecture and peaceful courtyards.',
      city: 'Sharjah',
      category: 'Architecture',
      budget: '$',
      duration: '1 hour',
      bestTime: 'Late afternoon',
      location: 'Sharjah Corniche',
      suitableFor: 'Cultural enthusiasts, photography lovers',
      tips: 'Modest dress required, guided tours on weekends'
    },

    // FUJAIRAH - Nature & Adventure
    {
      id: 'fujairah_fort',
      title: 'Fujairah Fort',
      description: 'Historic 17th-century fort with panoramic mountain views and insights into traditional Emirati defense architecture.',
      city: 'Fujairah',
      category: 'Culture',
      budget: '$',
      duration: '1 hour',
      bestTime: 'Morning or late afternoon',
      location: 'Fujairah City',
      suitableFor: 'History enthusiasts, families',
      tips: 'Combine with nearby museum visit'
    },
    {
      id: 'fujairah_wadi_wurayah',
      title: 'Wadi Wurayah',
      description: 'UAE\'s first mountain protected area with hiking trails, natural pools, and diverse wildlife in stunning mountain scenery.',
      city: 'Fujairah',
      category: 'Nature',
      budget: '$',
      duration: '4 hours',
      bestTime: 'Early morning',
      location: 'Hajar Mountains',
      suitableFor: 'Hikers, nature lovers, photographers',
      tips: '4WD vehicle recommended, bring plenty of water'
    },
    {
      id: 'fujairah_snoopy_island',
      title: 'Snorkeling at Snoopy Island',
      description: 'Crystal clear waters perfect for snorkeling with colorful coral reefs and tropical fish around distinctive rock formation.',
      city: 'Fujairah',
      category: 'Adventure',
      budget: '$$',
      duration: '3 hours',
      bestTime: 'Morning for best visibility',
      location: 'Sandy Beach Resort area',
      suitableFor: 'Swimmers, marine life enthusiasts',
      tips: 'Equipment rental available, swimming skills required'
    },

    // RAS AL KHAIMAH - Adventure Capital
    {
      id: 'rak_jebel_jais_zipline',
      title: 'Jebel Jais Zipline',
      description: 'World\'s longest zipline stretching 2.83km at speeds up to 120kph with breathtaking mountain views.',
      city: 'Ras Al Khaimah',
      category: 'Adventure',
      budget: '$$$',
      duration: '4 hours',
      bestTime: 'Morning or afternoon',
      location: 'Jebel Jais',
      suitableFor: 'Thrill seekers, adventure enthusiasts',
      tips: 'Advance booking essential, weight restrictions apply'
    },
    {
      id: 'rak_jais_adventure_park',
      title: 'Jais Adventure Park',
      description: 'Mountain adventure park with ziplines, climbing walls, and hiking trails offering spectacular Hajar Mountain views.',
      city: 'Ras Al Khaimah',
      category: 'Adventure',
      budget: '$$',
      duration: '3 hours',
      bestTime: 'Morning or late afternoon',
      location: 'Jebel Jais',
      suitableFor: 'Adventure families, fitness enthusiasts',
      tips: 'Dress for cooler mountain weather'
    },

    // AL AIN - Garden City
    {
      id: 'alain_oasis',
      title: 'Al Ain Oasis',
      description: 'UNESCO World Heritage site with traditional falaj irrigation system and over 147,000 date palms creating green sanctuary.',
      city: 'Al Ain',
      category: 'Nature',
      budget: '$',
      duration: '2 hours',
      bestTime: 'Morning or late afternoon',
      location: 'Al Ain City Center',
      suitableFor: 'Nature lovers, families, history enthusiasts',
      tips: 'Free entry, visitor center has informative displays'
    },
    {
      id: 'alain_jebel_hafeet',
      title: 'Jebel Hafeet',
      description: 'UAE\'s second highest peak with winding mountain road, stunning views, and natural hot springs at the base.',
      city: 'Al Ain',
      category: 'Nature',
      budget: '$',
      duration: '3 hours',
      bestTime: 'Late afternoon for sunset',
      location: 'Al Ain',
      suitableFor: 'Drivers, families, photography enthusiasts',
      tips: 'Drive carefully on mountain roads, restaurants at summit'
    },
    {
      id: 'alain_zoo',
      title: 'Al Ain Zoo',
      description: 'Large zoo and aquarium with over 4,000 animals including endangered Arabian species in naturalistic habitats.',
      city: 'Al Ain',
      category: 'Family',
      budget: '$$',
      duration: '4 hours',
      bestTime: 'Morning or late afternoon',
      location: 'Jebel Hafeet area',
      suitableFor: 'Families with children, animal lovers',
      tips: 'Bring sun protection, feeding sessions available'
    }
  ];
}

async function generateEmbedding(activity: Activity, openAIKey: string): Promise<number[]> {
  const text = `${activity.title} in ${activity.city}. ${activity.description} Category: ${activity.category}. Budget: ${activity.budget}. Duration: ${activity.duration}. Best time: ${activity.bestTime}. Location: ${activity.location}. Suitable for: ${activity.suitableFor}. ${activity.tips ? 'Tips: ' + activity.tips : ''}`;
  
  const response = await fetch('https://api.openai.com/v1/embeddings', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${openAIKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'text-embedding-3-small',
      input: text,
    }),
  });

  if (!response.ok) {
    throw new Error(`OpenAI API error: ${response.statusText}`);
  }

  const data = await response.json();
  return data.data[0].embedding;
}

async function syncToPinecone(activity: Activity, embedding: number[], pineconeKey: string) {
  const response = await fetch('https://make-uae-mvp-8w3f0s3.svc.aped-4627-b74a.pinecone.io/vectors/upsert', {
    method: 'POST',
    headers: {
      'Api-Key': pineconeKey,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      vectors: [{
        id: activity.id,
        values: embedding,
        metadata: {
          title: activity.title,
          description: activity.description,
          city: activity.city,
          category: activity.category,
          budget: activity.budget,
          duration: activity.duration,
          bestTime: activity.bestTime,
          location: activity.location,
          suitableFor: activity.suitableFor,
          tips: activity.tips || ''
        }
      }]
    }),
  });

  if (!response.ok) {
    throw new Error(`Pinecone API error: ${response.statusText}`);
  }

  return await response.json();
}
