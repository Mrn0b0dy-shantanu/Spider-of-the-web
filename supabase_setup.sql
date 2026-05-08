-- Run this script in the Supabase SQL Editor to set up your tables

-- Incidents Table
CREATE TABLE IF NOT EXISTS public.incidents (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  name text NOT NULL,
  type text NOT NULL,
  location text NOT NULL,
  status text NOT NULL,
  description text,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Inventory Table
CREATE TABLE IF NOT EXISTS public.inventory (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  name text NOT NULL,
  category text NOT NULL,
  quantity integer NOT NULL DEFAULT 0,
  unit text NOT NULL,
  location text NOT NULL,
  status text NOT NULL,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Personnel Table
CREATE TABLE IF NOT EXISTS public.personnel (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  name text NOT NULL,
  role text NOT NULL,
  organization text NOT NULL,
  location text NOT NULL,
  status text NOT NULL,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Organizations Table
CREATE TABLE IF NOT EXISTS public.organizations (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  name text NOT NULL,
  type text NOT NULL,
  personnel_count integer NOT NULL DEFAULT 0,
  contact_email text NOT NULL,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Requests Table
CREATE TABLE IF NOT EXISTS public.requests (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  item text NOT NULL,
  quantity integer NOT NULL,
  unit text NOT NULL,
  destination text NOT NULL,
  priority text NOT NULL,
  status text NOT NULL DEFAULT 'Pending',
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Insert Initial Mock Data so the Dashboard isn't empty!
INSERT INTO public.incidents (name, type, location, status, description) VALUES
('Sylhet Flood Relief', 'Flood', 'Sylhet Division', 'Critical', 'Severe flooding affecting over 2 million people.'),
('Dhaka Earthquake Eq-7.1', 'Earthquake', 'Dhaka Metro', 'Active', 'Magnitude 7.1 earthquake. Infrastructure damage reported.'),
('Chittagong Landslide', 'Landslide', 'Chittagong Hill Tracts', 'Monitoring', 'Heavy rains caused landslides blocking major roads.');

INSERT INTO public.inventory (name, category, quantity, unit, location, status) VALUES
('Medical Kits', 'Medical', 5400, 'Kits', 'Central Warehouse', 'Available'),
('Clean Water', 'Food & Water', 15000, 'Liters', 'Sylhet Hub', 'Available'),
('Tents', 'Shelter', 120, 'Units', 'Chittagong Hub', 'Low Stock'),
('Generators', 'Equipment', 0, 'Units', 'Central Warehouse', 'Out of Stock');

INSERT INTO public.personnel (name, role, organization, location, status) VALUES
('Dr. Ahmed Hossain', 'Medical Officer', 'Red Crescent', 'Sylhet Zone A', 'Deployed'),
('Sarah Khan', 'Logistics Coordinator', 'NDC Relief', 'Dhaka HQ', 'Available'),
('Team Alpha (S&R)', 'Search & Rescue', 'Fire Service', 'Dhaka Sector 4', 'Deployed');

INSERT INTO public.organizations (name, type, personnel_count, contact_email) VALUES
('NDC ReliefOps', 'Government', 1500, 'contact@ndc.gov.bd'),
('Red Crescent Society', 'NGO', 3500, 'info@redcrescent.org'),
('UNICEF Bangladesh', 'International', 800, 'dhaka@unicef.org');

INSERT INTO public.requests (item, quantity, unit, destination, priority, status) VALUES
('Medical Kits', 500, 'Kits', 'Sylhet Zone A', 'High', 'Pending'),
('Search & Rescue Team', 2, 'Teams', 'Dhaka Sector 4', 'High', 'Approved'),
('Clean Water', 10000, 'Liters', 'Chittagong Camp', 'Medium', 'Pending');
