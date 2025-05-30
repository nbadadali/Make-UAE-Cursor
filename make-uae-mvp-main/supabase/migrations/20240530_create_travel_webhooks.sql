-- Create webhook triggers for cities table
CREATE TRIGGER cities_webhook_insert
AFTER INSERT ON cities
FOR EACH ROW
EXECUTE FUNCTION supabase_functions.http_request(
  'https://uexzbndctezqhbtrflxj.supabase.co/functions/v1/sync-to-pinecone',
  'POST',
  '{"Content-Type":"application/json"}',
  json_build_object('type', 'INSERT', 'table', 'cities', 'record', row_to_json(NEW))::text
);

CREATE TRIGGER cities_webhook_update
AFTER UPDATE ON cities
FOR EACH ROW
EXECUTE FUNCTION supabase_functions.http_request(
  'https://uexzbndctezqhbtrflxj.supabase.co/functions/v1/sync-to-pinecone',
  'POST',
  '{"Content-Type":"application/json"}',
  json_build_object('type', 'UPDATE', 'table', 'cities', 'record', row_to_json(NEW), 'old_record', row_to_json(OLD))::text
);

CREATE TRIGGER cities_webhook_delete
AFTER DELETE ON cities
FOR EACH ROW
EXECUTE FUNCTION supabase_functions.http_request(
  'https://uexzbndctezqhbtrflxj.supabase.co/functions/v1/sync-to-pinecone',
  'POST',
  '{"Content-Type":"application/json"}',
  json_build_object('type', 'DELETE', 'table', 'cities', 'old_record', row_to_json(OLD))::text
);

-- Create webhook triggers for activities table
CREATE TRIGGER activities_webhook_insert
AFTER INSERT ON activities
FOR EACH ROW
EXECUTE FUNCTION supabase_functions.http_request(
  'https://uexzbndctezqhbtrflxj.supabase.co/functions/v1/sync-to-pinecone',
  'POST',
  '{"Content-Type":"application/json"}',
  json_build_object('type', 'INSERT', 'table', 'activities', 'record', row_to_json(NEW))::text
);

CREATE TRIGGER activities_webhook_update
AFTER UPDATE ON activities
FOR EACH ROW
EXECUTE FUNCTION supabase_functions.http_request(
  'https://uexzbndctezqhbtrflxj.supabase.co/functions/v1/sync-to-pinecone',
  'POST',
  '{"Content-Type":"application/json"}',
  json_build_object('type', 'UPDATE', 'table', 'activities', 'record', row_to_json(NEW), 'old_record', row_to_json(OLD))::text
);

CREATE TRIGGER activities_webhook_delete
AFTER DELETE ON activities
FOR EACH ROW
EXECUTE FUNCTION supabase_functions.http_request(
  'https://uexzbndctezqhbtrflxj.supabase.co/functions/v1/sync-to-pinecone',
  'POST',
  '{"Content-Type":"application/json"}',
  json_build_object('type', 'DELETE', 'table', 'activities', 'old_record', row_to_json(OLD))::text
); 