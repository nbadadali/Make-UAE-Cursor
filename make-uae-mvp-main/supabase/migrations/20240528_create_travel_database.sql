-- Create enum types for categories
CREATE TYPE activity_category AS ENUM ('Architecture', 'Adventure', 'Culture', 'Nature', 'Family');
CREATE TYPE budget_category AS ENUM ('$', '$$', '$$$');

-- Create cities table
CREATE TABLE cities (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT,
    best_for TEXT[],
    airport TEXT,
    key_areas TEXT[],
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create activities table
CREATE TABLE activities (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT,
    city_id TEXT REFERENCES cities(id),
    category activity_category,
    budget budget_category,
    duration TEXT,
    best_time TEXT,
    location TEXT,
    suitable_for TEXT,
    tips TEXT,
    image TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create a function to update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_cities_updated_at
    BEFORE UPDATE ON cities
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_activities_updated_at
    BEFORE UPDATE ON activities
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Enable Row Level Security (RLS)
ALTER TABLE cities ENABLE ROW LEVEL SECURITY;
ALTER TABLE activities ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Enable read access for all users" ON cities
    FOR SELECT USING (true);

CREATE POLICY "Enable read access for all users" ON activities
    FOR SELECT USING (true);

-- Create indexes for better performance
CREATE INDEX idx_activities_city_id ON activities(city_id);
CREATE INDEX idx_activities_category ON activities(category);
CREATE INDEX idx_activities_budget ON activities(budget); 