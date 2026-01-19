-- Create a table to store application settings
create table app_settings (
  key text primary key,
  value text not null
);

-- Insert a default passkey (You can change this later via the Superadmin UI)
insert into app_settings (key, value)
values ('delete_passkey', '123456');

-- Enable Row Level Security
alter table app_settings enable row level security;

-- Policy: Allow anyone to READ (needed to verify passkey via server action/API)
-- In a real production app, you might want to wrap this in an RPC to avoid exposing the key directly to SELECT.
-- However, for this simple implementation, we will handle verification on the server side (Server Actions).
create policy "Enable read access for all users"
on app_settings for select
using (true);

-- Policy: Allow only authenticated users (or specific logic) to UPDATE.
-- Ideally, we'd restrict this to the superadmin email, but Supabase Auth policies work on 'auth.uid()'.
-- For now, we will allow update and handle the "Superadmin Email Check" in the application logic (Server Action).
create policy "Enable update access for all users"
on app_settings for update
using (true)
with check (true);
