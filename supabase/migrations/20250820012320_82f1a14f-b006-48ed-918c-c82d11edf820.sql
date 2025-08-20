-- Create profiles table for additional user information
CREATE TABLE public.profiles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create customers table
CREATE TABLE public.customers (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  email TEXT,
  phone TEXT,
  address TEXT,
  city TEXT,
  postcode TEXT,
  customer_type TEXT CHECK (customer_type IN ('residential', 'commercial', 'builder')),
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create projects table
CREATE TABLE public.projects (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  customer_id UUID REFERENCES public.customers(id) ON DELETE SET NULL,
  project_name TEXT NOT NULL,
  project_type TEXT CHECK (project_type IN ('kitchen', 'bathroom', 'fireplace', 'commercial', 'outdoor', 'other')),
  status TEXT CHECK (status IN ('quote', 'approved', 'in-progress', 'completed', 'cancelled')) DEFAULT 'quote',
  expected_delivery TIMESTAMP WITH TIME ZONE,
  total_cost DECIMAL(12,2) DEFAULT 0,
  notes TEXT,
  address TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create materials table
CREATE TABLE public.materials (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  supplier TEXT,
  category TEXT CHECK (category IN ('granite', 'marble', 'quartz', 'quartzite', 'limestone', 'travertine', 'slate')),
  finish TEXT CHECK (finish IN ('polished', 'honed', 'leathered', 'flamed', 'brushed')),
  sell_price DECIMAL(10,2),
  availability TEXT CHECK (availability IN ('in-stock', 'order-in', 'discontinued')),
  lead_time INTEGER,
  description TEXT,
  image_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create quotes table
CREATE TABLE public.quotes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  project_id UUID REFERENCES public.projects(id) ON DELETE CASCADE,
  quote_number TEXT NOT NULL,
  version INTEGER DEFAULT 1,
  status TEXT CHECK (status IN ('draft', 'sent', 'approved', 'rejected', 'expired')) DEFAULT 'draft',
  valid_until TIMESTAMP WITH TIME ZONE,
  subtotal DECIMAL(12,2) DEFAULT 0,
  gst DECIMAL(12,2) DEFAULT 0,
  total DECIMAL(12,2) DEFAULT 0,
  notes TEXT,
  terms TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create quote_items table
CREATE TABLE public.quote_items (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  quote_id UUID NOT NULL REFERENCES public.quotes(id) ON DELETE CASCADE,
  description TEXT NOT NULL,
  category TEXT CHECK (category IN ('material', 'fabrication', 'installation', 'extras')),
  quantity DECIMAL(10,2) NOT NULL,
  unit TEXT DEFAULT 'each',
  unit_price DECIMAL(10,2) NOT NULL,
  total_price DECIMAL(12,2) NOT NULL,
  material_id UUID REFERENCES public.materials(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create business_profiles table
CREATE TABLE public.business_profiles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  company_name TEXT,
  abn TEXT,
  contact_person TEXT,
  email TEXT,
  phone TEXT,
  address TEXT,
  city TEXT,
  state TEXT,
  postcode TEXT,
  logo TEXT,
  markup DECIMAL(5,2) DEFAULT 0,
  gst_rate DECIMAL(5,2) DEFAULT 10,
  labor_rate DECIMAL(8,2) DEFAULT 0,
  business_hours TEXT,
  service_areas TEXT[],
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.materials ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quotes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quote_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.business_profiles ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for profiles
CREATE POLICY "Users can view their own profile" ON public.profiles
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own profile" ON public.profiles
  FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = user_id);

-- Create RLS policies for customers
CREATE POLICY "Users can view their own customers" ON public.customers
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create their own customers" ON public.customers
  FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own customers" ON public.customers
  FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own customers" ON public.customers
  FOR DELETE USING (auth.uid() = user_id);

-- Create RLS policies for projects
CREATE POLICY "Users can view their own projects" ON public.projects
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create their own projects" ON public.projects
  FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own projects" ON public.projects
  FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own projects" ON public.projects
  FOR DELETE USING (auth.uid() = user_id);

-- Create RLS policies for materials
CREATE POLICY "Users can view their own materials" ON public.materials
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create their own materials" ON public.materials
  FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own materials" ON public.materials
  FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own materials" ON public.materials
  FOR DELETE USING (auth.uid() = user_id);

-- Create RLS policies for quotes
CREATE POLICY "Users can view their own quotes" ON public.quotes
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create their own quotes" ON public.quotes
  FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own quotes" ON public.quotes
  FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own quotes" ON public.quotes
  FOR DELETE USING (auth.uid() = user_id);

-- Create RLS policies for quote_items
CREATE POLICY "Users can view quote items for their quotes" ON public.quote_items
  FOR SELECT USING (EXISTS (SELECT 1 FROM public.quotes WHERE quotes.id = quote_items.quote_id AND quotes.user_id = auth.uid()));
CREATE POLICY "Users can create quote items for their quotes" ON public.quote_items
  FOR INSERT WITH CHECK (EXISTS (SELECT 1 FROM public.quotes WHERE quotes.id = quote_items.quote_id AND quotes.user_id = auth.uid()));
CREATE POLICY "Users can update quote items for their quotes" ON public.quote_items
  FOR UPDATE USING (EXISTS (SELECT 1 FROM public.quotes WHERE quotes.id = quote_items.quote_id AND quotes.user_id = auth.uid()));
CREATE POLICY "Users can delete quote items for their quotes" ON public.quote_items
  FOR DELETE USING (EXISTS (SELECT 1 FROM public.quotes WHERE quotes.id = quote_items.quote_id AND quotes.user_id = auth.uid()));

-- Create RLS policies for business_profiles
CREATE POLICY "Users can view their own business profile" ON public.business_profiles
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create their own business profile" ON public.business_profiles
  FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own business profile" ON public.business_profiles
  FOR UPDATE USING (auth.uid() = user_id);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for automatic timestamp updates
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_customers_updated_at
  BEFORE UPDATE ON public.customers
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_projects_updated_at
  BEFORE UPDATE ON public.projects
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_materials_updated_at
  BEFORE UPDATE ON public.materials
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_quotes_updated_at
  BEFORE UPDATE ON public.quotes
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_business_profiles_updated_at
  BEFORE UPDATE ON public.business_profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();