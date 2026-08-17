-- AI Panchayat Database Schema for Supabase

-- 1. PROFILES TABLE (Linked to Supabase Auth)
CREATE TABLE public.profiles (
    id UUID REFERENCES auth.users(id) PRIMARY KEY,
    phone TEXT UNIQUE NOT NULL,
    role TEXT NOT NULL DEFAULT 'citizen' CHECK (role IN ('citizen', 'staff', 'admin')),
    full_name TEXT,
    language_pref TEXT DEFAULT 'hi',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. REQUESTS TABLE (For Certificates/Documents)
CREATE TABLE public.requests (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES public.profiles(id) NOT NULL,
    type TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'in_progress', 'approved', 'rejected')),
    details JSONB DEFAULT '{}'::jsonb,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. GRIEVANCES TABLE (For Complaints)
CREATE TABLE public.grievances (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES public.profiles(id) NOT NULL,
    category TEXT NOT NULL,
    description TEXT NOT NULL,
    photo_url TEXT,
    location JSONB,
    status TEXT NOT NULL DEFAULT 'open' CHECK (status IN ('open', 'in_progress', 'resolved', 'closed')),
    resolution_notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 4. NOTICES TABLE (For Announcements)
CREATE TABLE public.notices (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    author_id UUID REFERENCES public.profiles(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 5. SCHEMES TABLE (For Scheme Finder)
CREATE TABLE public.schemes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    eligibility_criteria TEXT NOT NULL,
    tags TEXT[] DEFAULT '{}'::text[],
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Setup Row Level Security (RLS) policies
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.grievances ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notices ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.schemes ENABLE ROW LEVEL SECURITY;

-- Seed some initial schemes
INSERT INTO public.schemes (title, description, eligibility_criteria, tags) VALUES
('PM Kisan Samman Nidhi', 'Income support of Rs 6,000 per year for all landholding farmers.', 'Small and marginal farmers holding cultivable land. Must not be income tax payer or government employee.', '{"agriculture", "financial"}'),
('Pradhan Mantri Awas Yojana (Gramin)', 'Housing for all in rural areas.', 'Rural families without pucca house, low income. Selection based on SECC 2011 data.', '{"housing", "rural"}'),
('Mahatma Gandhi NREGA', '100 days of guaranteed wage employment in a financial year.', 'Adult members of rural households willing to do unskilled manual work.', '{"employment", "rural"}');
