
-- Community Relief Network (Aid Network) Setup Script
-- Run this in your Supabase SQL Editor

-- 1. Community Requests Table
CREATE TABLE IF NOT EXISTS public.community_requests (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  title text NOT NULL,
  category text NOT NULL, -- water, food, medicine, shelter, etc.
  description text NOT NULL,
  urgency text NOT NULL DEFAULT 'medium', -- low, medium, high, critical
  quantity_needed integer NOT NULL DEFAULT 1,
  quantity_fulfilled integer NOT NULL DEFAULT 0,
  location text NOT NULL,
  image_url text,
  contact_info text,
  expires_at timestamp with time zone,
  status text NOT NULL DEFAULT 'pending', -- pending, partially_fulfilled, fulfilled, expired, cancelled
  is_pinned boolean DEFAULT false,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Fulfillments Table (Who is helping with what)
CREATE TABLE IF NOT EXISTS public.community_fulfillments (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  request_id uuid REFERENCES public.community_requests(id) ON DELETE CASCADE NOT NULL,
  user_id uuid REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  quantity integer NOT NULL DEFAULT 1,
  status text NOT NULL DEFAULT 'pending', -- pending, in_progress, delivered
  notes text,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. Comments / Updates Table
CREATE TABLE IF NOT EXISTS public.community_comments (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  request_id uuid REFERENCES public.community_requests(id) ON DELETE CASCADE NOT NULL,
  user_id uuid REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  message text NOT NULL,
  is_admin_update boolean DEFAULT false,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 4. Notifications Table
CREATE TABLE IF NOT EXISTS public.community_notifications (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  request_id uuid REFERENCES public.community_requests(id) ON DELETE SET NULL,
  type text NOT NULL, -- help_offered, request_fulfilled, admin_intervention, comment_added
  message text NOT NULL,
  is_read boolean DEFAULT false,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 5. Community Offers Table (Proactive help from volunteers)
CREATE TABLE IF NOT EXISTS public.community_offers (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  title text NOT NULL,
  category text NOT NULL,
  description text NOT NULL,
  quantity integer NOT NULL DEFAULT 1,
  location text NOT NULL,
  help_methods text[], -- e.g., ["delivery", "pickup", "onsite"]
  status text NOT NULL DEFAULT 'available', -- available, partially_given, completed, cancelled
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 6. Row Level Security (RLS)
ALTER TABLE public.community_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.community_fulfillments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.community_comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.community_notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.community_offers ENABLE ROW LEVEL SECURITY;

-- Basic Policies
CREATE POLICY "Allow authenticated users to read requests" ON public.community_requests FOR SELECT TO authenticated USING (true);
CREATE POLICY "Allow authenticated users to create requests" ON public.community_requests FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Allow users to update their own requests" ON public.community_requests FOR UPDATE TO authenticated USING (auth.uid() = user_id);

CREATE POLICY "Allow authenticated users to read fulfillments" ON public.community_fulfillments FOR SELECT TO authenticated USING (true);
CREATE POLICY "Allow authenticated users to create fulfillments" ON public.community_fulfillments FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Allow authenticated users to read comments" ON public.community_comments FOR SELECT TO authenticated USING (true);
CREATE POLICY "Allow authenticated users to create comments" ON public.community_comments FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Allow users to read their own notifications" ON public.community_notifications FOR SELECT TO authenticated USING (auth.uid() = user_id);

CREATE POLICY "Allow authenticated users to read offers" ON public.community_offers FOR SELECT TO authenticated USING (true);
CREATE POLICY "Allow authenticated users to create offers" ON public.community_offers FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Allow users to update their own offers" ON public.community_offers FOR UPDATE TO authenticated USING (auth.uid() = user_id);

-- 7. Enable Realtime
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM pg_publication WHERE pubname = 'supabase_realtime') THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE community_requests;
    ALTER PUBLICATION supabase_realtime ADD TABLE community_fulfillments;
    ALTER PUBLICATION supabase_realtime ADD TABLE community_comments;
    ALTER PUBLICATION supabase_realtime ADD TABLE community_notifications;
    ALTER PUBLICATION supabase_realtime ADD TABLE community_offers;
  END IF;
END $$;
