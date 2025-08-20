import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '../hooks/use-auth';

// Helper function to transform database data to frontend types
const transformCustomer = (dbCustomer: any) => ({
  ...dbCustomer,
  customerType: dbCustomer.customer_type,
  createdAt: new Date(dbCustomer.created_at),
});

const transformProject = (dbProject: any) => ({
  ...dbProject,
  customerId: dbProject.customer_id,
  projectName: dbProject.project_name,
  projectType: dbProject.project_type,
  totalCost: dbProject.total_cost,
  expectedDelivery: dbProject.expected_delivery ? new Date(dbProject.expected_delivery) : undefined,
  createdAt: new Date(dbProject.created_at),
  surfaces: [], // placeholder
  measurements: [], // placeholder
});

const transformQuote = (dbQuote: any) => ({
  ...dbQuote,
  projectId: dbQuote.project_id,
  quoteNumber: dbQuote.quote_number,
  validUntil: new Date(dbQuote.valid_until),
  createdAt: new Date(dbQuote.created_at),
  sentAt: dbQuote.sent_at ? new Date(dbQuote.sent_at) : undefined,
  items: dbQuote.quote_items || [],
});

export function useApi() {
  const { user } = useAuth();
  
  return {
    // Customers API
    getCustomers: async () => {
      const result = await supabase.from('customers').select('*').order('created_at', { ascending: false });
      if (result.data) {
        const transformedData = result.data.map(transformCustomer);
        return { ...result, data: transformedData };
      }
      return result;
    },
    getCustomer: async (id: string) => {
      const result = await supabase.from('customers').select('*').eq('id', id).single();
      if (result.data) {
        const transformedData = transformCustomer(result.data);
        return { ...result, data: transformedData };
      }
      return result;
    },
    createCustomer: async (data: any) => {
      const dbData = { ...data, customer_type: data.customerType, user_id: user?.id };
      const result = await supabase.from('customers').insert(dbData).select().single();
      if (result.data) {
        const transformedData = transformCustomer(result.data);
        return { ...result, data: transformedData };
      }
      return result;
    },
    updateCustomer: async (id: string, data: any) => {
      const dbData = { ...data, customer_type: data.customerType || data.customer_type };
      const result = await supabase.from('customers').update(dbData).eq('id', id).select().single();
      if (result.data) {
        const transformedData = transformCustomer(result.data);
        return { ...result, data: transformedData };
      }
      return result;
    },
    deleteCustomer: (id: string) => supabase.from('customers').delete().eq('id', id),

    // Projects API
    getProjects: async () => {
      const result = await supabase.from('projects').select('*').order('created_at', { ascending: false });
      if (result.data) {
        const transformedData = result.data.map(transformProject);
        return { ...result, data: transformedData };
      }
      return result;
    },
    getProject: async (id: string) => {
      const result = await supabase.from('projects').select('*').eq('id', id).single();
      if (result.data) {
        const transformedData = transformProject(result.data);
        return { ...result, data: transformedData };
      }
      return result;
    },
    createProject: async (data: any) => {
      const dbData = { 
        ...data, 
        customer_id: data.customerId,
        project_name: data.projectName, 
        project_type: data.projectType,
        total_cost: data.totalCost,
        expected_delivery: data.expectedDelivery,
        user_id: user?.id 
      };
      const result = await supabase.from('projects').insert(dbData).select().single();
      if (result.data) {
        const transformedData = transformProject(result.data);
        return { ...result, data: transformedData };
      }
      return result;
    },
    updateProject: async (id: string, data: any) => {
      const dbData = { 
        ...data, 
        customer_id: data.customerId || data.customer_id,
        project_name: data.projectName || data.project_name, 
        project_type: data.projectType || data.project_type,
        total_cost: data.totalCost || data.total_cost,
        expected_delivery: data.expectedDelivery || data.expected_delivery,
      };
      const result = await supabase.from('projects').update(dbData).eq('id', id).select().single();
      if (result.data) {
        const transformedData = transformProject(result.data);
        return { ...result, data: transformedData };
      }
      return result;
    },
    deleteProject: (id: string) => supabase.from('projects').delete().eq('id', id),

    // Materials API
    getMaterials: async () => {
      const result = await supabase.from('materials').select('*').order('id', { ascending: false });
      if (result.data) {
        const transformedData = result.data.map(material => {
          const { sell_price, lead_time, image_url, ...rest } = material;
          return {
            ...rest,
            sellPrice: sell_price,
            leadTime: lead_time,
            imageUrl: image_url,
          };
        });
        return { ...result, data: transformedData };
      }
      return result;
    },
    getMaterial: async (id: string) => {
      const result = await supabase.from('materials').select('*').eq('id', id).single();
      if (result.data) {
        const { sell_price, lead_time, image_url, ...rest } = result.data;
        const transformedData = {
          ...rest,
          sellPrice: sell_price,
          leadTime: lead_time,
          imageUrl: image_url,
        };
        return { ...result, data: transformedData };
      }
      return result;
    },
    createMaterial: async (data: any) => {
      const dbData = { 
        ...data, 
        sell_price: data.sellPrice,
        lead_time: data.leadTime,
        image_url: data.imageUrl,
        user_id: user?.id 
      };
      return supabase.from('materials').insert(dbData).select().single();
    },
    updateMaterial: async (id: string, data: any) => {
      const dbData = { 
        ...data, 
        sell_price: data.sellPrice || data.sell_price,
        lead_time: data.leadTime || data.lead_time,
        image_url: data.imageUrl || data.image_url,
      };
      return supabase.from('materials').update(dbData).eq('id', id).select().single();
    },
    deleteMaterial: (id: string) => supabase.from('materials').delete().eq('id', id),

    // Quotes API
    getQuotes: async () => {
      const result = await supabase.from('quotes').select('*, quote_items(*)').order('created_at', { ascending: false });
      if (result.data) {
        const transformedData = result.data.map(transformQuote);
        return { ...result, data: transformedData };
      }
      return result;
    },
    getQuote: async (id: string) => {
      const result = await supabase.from('quotes').select('*, quote_items(*)').eq('id', id).single();
      if (result.data) {
        const transformedData = transformQuote(result.data);
        return { ...result, data: transformedData };
      }
      return result;
    },
    createQuote: async (data: any) => {
      const { items, ...quoteData } = data;
      const dbData = {
        ...quoteData,
        project_id: data.projectId,
        quote_number: data.quoteNumber,
        valid_until: data.validUntil,
        user_id: user?.id
      };
      const { data: quote, error } = await supabase.from('quotes').insert(dbData).select().single();
      if (error) throw error;
      
      if (items && items.length > 0) {
        const { error: itemsError } = await supabase.from('quote_items').insert(
          items.map((item: any) => ({ ...item, quote_id: quote.id }))
        );
        if (itemsError) throw itemsError;
      }
      return { data: transformQuote(quote), error: null };
    },
    updateQuote: async (id: string, data: any) => {
      const { items, ...quoteData } = data;
      const dbData = {
        ...quoteData,
        project_id: data.projectId || data.project_id,
        quote_number: data.quoteNumber || data.quote_number,
        valid_until: data.validUntil || data.valid_until,
      };
      const { data: quote, error } = await supabase.from('quotes').update(dbData).eq('id', id).select().single();
      if (error) throw error;
      
      // Delete existing items and insert new ones
      if (items) {
        await supabase.from('quote_items').delete().eq('quote_id', id);
        if (items.length > 0) {
          const { error: itemsError } = await supabase.from('quote_items').insert(
            items.map((item: any) => ({ ...item, quote_id: id }))
          );
          if (itemsError) throw itemsError;
        }
      }
      return { data: transformQuote(quote), error: null };
    },
    deleteQuote: async (id: string) => {
      await supabase.from('quote_items').delete().eq('quote_id', id);
      return supabase.from('quotes').delete().eq('id', id);
    },

    // Business Profile API
    getBusinessProfile: () => supabase.from('business_profiles').select('*').eq('user_id', user?.id).maybeSingle(),
    updateBusinessProfile: async (data: any) => {
      const { data: existing } = await supabase.from('business_profiles').select('id').eq('user_id', user?.id).maybeSingle();
      
      if (existing) {
        return supabase.from('business_profiles').update(data).eq('user_id', user?.id).select().single();
      } else {
        return supabase.from('business_profiles').insert({ ...data, user_id: user?.id }).select().single();
      }
    },
  };
}
