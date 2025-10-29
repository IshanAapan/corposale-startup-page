-- Create table for storing OTPs
CREATE TABLE IF NOT EXISTS public.email_otps (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT NOT NULL,
  otp TEXT NOT NULL,
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  verified BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create index for faster lookups
CREATE INDEX idx_email_otps_email ON public.email_otps(email);
CREATE INDEX idx_email_otps_expires_at ON public.email_otps(expires_at);

-- Enable RLS
ALTER TABLE public.email_otps ENABLE ROW LEVEL SECURITY;

-- Allow anyone to insert OTPs (for registration)
CREATE POLICY "Anyone can insert OTPs" 
ON public.email_otps 
FOR INSERT 
WITH CHECK (true);

-- Allow anyone to read their own OTPs
CREATE POLICY "Anyone can read OTPs" 
ON public.email_otps 
FOR SELECT 
USING (true);

-- Create table for storing invite codes
CREATE TABLE IF NOT EXISTS public.invite_codes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT NOT NULL UNIQUE,
  invite_code TEXT NOT NULL UNIQUE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create index for faster lookups
CREATE INDEX idx_invite_codes_email ON public.invite_codes(email);
CREATE INDEX idx_invite_codes_code ON public.invite_codes(invite_code);

-- Enable RLS
ALTER TABLE public.invite_codes ENABLE ROW LEVEL SECURITY;

-- Allow anyone to insert invite codes
CREATE POLICY "Anyone can insert invite codes" 
ON public.invite_codes 
FOR INSERT 
WITH CHECK (true);

-- Allow anyone to read invite codes
CREATE POLICY "Anyone can read invite codes" 
ON public.invite_codes 
FOR SELECT 
USING (true);

-- Create table for lead submissions
CREATE TABLE IF NOT EXISTS public.lead_submissions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  location TEXT NOT NULL,
  category TEXT NOT NULL,
  invite_code TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create index for faster lookups
CREATE INDEX idx_lead_submissions_email ON public.lead_submissions(email);

-- Enable RLS
ALTER TABLE public.lead_submissions ENABLE ROW LEVEL SECURITY;

-- Allow anyone to insert submissions
CREATE POLICY "Anyone can insert submissions" 
ON public.lead_submissions 
FOR INSERT 
WITH CHECK (true);

-- Allow anyone to read submissions
CREATE POLICY "Anyone can read submissions" 
ON public.lead_submissions 
FOR SELECT 
USING (true);