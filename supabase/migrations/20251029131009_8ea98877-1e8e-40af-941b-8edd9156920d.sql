-- Create company_domains table
CREATE TABLE public.company_domains (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  domain TEXT NOT NULL UNIQUE,
  is_approved BOOLEAN NOT NULL DEFAULT false,
  is_waitlisted BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.company_domains ENABLE ROW LEVEL SECURITY;

-- Create policy for public read access (anyone can check if a domain is approved)
CREATE POLICY "Anyone can view company domains" 
ON public.company_domains 
FOR SELECT 
USING (true);

-- Create policy for inserting new domains (anyone can add to waitlist)
CREATE POLICY "Anyone can insert company domains" 
ON public.company_domains 
FOR INSERT 
WITH CHECK (true);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_company_domains_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_company_domains_updated_at
BEFORE UPDATE ON public.company_domains
FOR EACH ROW
EXECUTE FUNCTION public.update_company_domains_updated_at();

-- Insert some initial approved domains
INSERT INTO public.company_domains (domain, is_approved, is_waitlisted) VALUES
('infosys.com', true, false),
('wipro.com', true, false),
('tcs.com', true, false);