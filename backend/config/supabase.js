const { createClient } = require('@supabase/supabase-js');

let supabaseClient;

const getSupabaseConfig = () => {
  const supabaseUrl = process.env.SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SERVICE_KEY;

  if (!supabaseUrl || !serviceRoleKey) {
    throw new Error('SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are required');
  }

  return { supabaseUrl, serviceRoleKey };
};

const getSupabase = () => {
  if (!supabaseClient) {
    const { supabaseUrl, serviceRoleKey } = getSupabaseConfig();
    supabaseClient = createClient(supabaseUrl, serviceRoleKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    });
  }

  return supabaseClient;
};

module.exports = {
  getSupabase,
  getSupabaseConfig
};
