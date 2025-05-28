import { createClient } from '@supabase/supabase-js';
import { readFileSync, readdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import matter from 'gray-matter';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Initialize Supabase client
const supabaseUrl = process.env.SUPABASE_URL || 'https://uexzbndctezqhbtrflxj.supabase.co';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

if (!supabaseKey) {
  console.error('Error: SUPABASE_SERVICE_ROLE_KEY is not set in .env file');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

interface City {
  id: string;
  name: string;
  description: string;
  best_for: string[];
  airport: string;
  key_areas: string[];
}

interface Activity {
  id: string;
  title: string;
  description: string;
  city_id: string;
  category: 'Architecture' | 'Adventure' | 'Culture' | 'Nature' | 'Family';
  budget: '$' | '$$' | '$$$';
  duration: string;
  best_time: string;
  location: string;
  suitable_for: string;
  tips: string;
  image?: string;
}

async function migrateCities() {
  const citiesDir = join(__dirname, '../docs/cities');
  const cityFiles = readdirSync(citiesDir).filter(file => file.endsWith('.md'));

  for (const file of cityFiles) {
    const content = readFileSync(join(citiesDir, file), 'utf-8');
    const { data, content: markdown } = matter(content);
    
    const cityId = file.replace('.md', '');
    const cityName = cityId.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
    
    // Extract overview section
    const overviewMatch = markdown.match(/## Overview\n([\s\S]*?)(?=\n##|$)/);
    const overview = overviewMatch ? overviewMatch[1].trim() : '';
    
    // Extract best_for and key_areas from the overview
    const bestForMatch = overview.match(/\*\*Best for\*\*: (.*?)(?=\n|$)/);
    const airportMatch = overview.match(/\*\*Airport\*\*: (.*?)(?=\n|$)/);
    const keyAreasMatch = overview.match(/\*\*Key Areas\*\*: (.*?)(?=\n|$)/);

    const city: City = {
      id: cityId,
      name: cityName,
      description: overview,
      best_for: bestForMatch ? bestForMatch[1].split(', ').map(s => s.trim()) : [],
      airport: airportMatch ? airportMatch[1].trim() : '',
      key_areas: keyAreasMatch ? keyAreasMatch[1].split(', ').map(s => s.trim()) : []
    };

    // Insert city into Supabase
    const { error } = await supabase.from('cities').upsert(city);
    if (error) {
      console.error(`Error inserting city ${cityName}:`, error);
    } else {
      console.log(`Successfully inserted city: ${cityName}`);
    }
  }
}

async function migrateActivities() {
  const citiesDir = join(__dirname, '../docs/cities');
  const cityFiles = readdirSync(citiesDir).filter(file => file.endsWith('.md'));

  for (const file of cityFiles) {
    const content = readFileSync(join(citiesDir, file), 'utf-8');
    const cityId = file.replace('.md', '');
    
    // Extract activity sections
    const activitySections = content.match(/### ([\s\S]*?)(?=###|$)/g) || [];
    
    for (const section of activitySections) {
      const idMatch = section.match(/\*\*ID\*\*: (\d+)/);
      const titleMatch = section.match(/### (.*?)\n/);
      const descriptionMatch = section.match(/\*\*Description\*\*: (.*?)(?=\n|$)/);
      const budgetMatch = section.match(/\*\*Budget\*\*: (\$+)/);
      const durationMatch = section.match(/\*\*Duration\*\*: (.*?)(?=\n|$)/);
      const bestTimeMatch = section.match(/\*\*Best Time\*\*: (.*?)(?=\n|$)/);
      const locationMatch = section.match(/\*\*Location\*\*: (.*?)(?=\n|$)/);
      const suitableForMatch = section.match(/\*\*Suitable For\*\*: (.*?)(?=\n|$)/);
      const tipsMatch = section.match(/\*\*Tips\*\*: (.*?)(?=\n|$)/);
      
      if (idMatch && titleMatch) {
        const activity: Activity = {
          id: `${cityId}_${idMatch[1]}`,
          title: titleMatch[1].trim(),
          description: descriptionMatch ? descriptionMatch[1].trim() : '',
          city_id: cityId,
          category: determineCategory(section),
          budget: (budgetMatch ? budgetMatch[1] : '$') as '$' | '$$' | '$$$',
          duration: durationMatch ? durationMatch[1].trim() : '',
          best_time: bestTimeMatch ? bestTimeMatch[1].trim() : '',
          location: locationMatch ? locationMatch[1].trim() : '',
          suitable_for: suitableForMatch ? suitableForMatch[1].trim() : '',
          tips: tipsMatch ? tipsMatch[1].trim() : '',
          image: determineEmoji(titleMatch[1])
        };

        // Insert activity into Supabase
        const { error } = await supabase.from('activities').upsert(activity);
        if (error) {
          console.error(`Error inserting activity ${activity.title}:`, error);
        } else {
          console.log(`Successfully inserted activity: ${activity.title}`);
        }
      }
    }
  }
}

function determineCategory(section: string): Activity['category'] {
  if (section.includes('## Architecture')) return 'Architecture';
  if (section.includes('## Adventure')) return 'Adventure';
  if (section.includes('## Culture')) return 'Culture';
  if (section.includes('## Nature')) return 'Nature';
  if (section.includes('## Family')) return 'Family';
  return 'Culture'; // Default category
}

function determineEmoji(title: string): string {
  const emojiMap: { [key: string]: string } = {
    'Burj Khalifa': '🏗️',
    'Desert Safari': '🐪',
    'Sheikh Zayed Grand Mosque': '🕌',
    'Beach': '🏖️',
    'Museum': '🏛️',
    'Garden': '🌸',
    'Water': '💦',
    'Mountain': '⛰️',
    'Zoo': '🦁',
    'Park': '🌳',
    'Fort': '🏰',
    'Market': '🏪',
    'Cruise': '🚢'
  };

  const emoji = Object.entries(emojiMap).find(([key]) => title.toLowerCase().includes(key.toLowerCase()));
  return emoji ? emoji[1] : '📍';
}

async function main() {
  try {
    console.log('Starting migration...');
    await migrateCities();
    await migrateActivities();
    console.log('Migration completed successfully!');
  } catch (error) {
    console.error('Migration failed:', error);
    process.exit(1);
  }
}

main(); 