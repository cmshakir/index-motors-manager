import { createClient } from '@supabase/supabase-js';

// Retrieve credentials from Vite env or user-saved localStorage
export const getCloudCredentials = () => {
  const envUrl = import.meta.env.VITE_SUPABASE_URL;
  const envKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
  if (envUrl && envKey && envUrl.startsWith('https://') && !envUrl.includes('your-project-id')) {
    return { url: envUrl, key: envKey, source: 'env' };
  }

  try {
    const localUrl = localStorage.getItem('index_motors_supabase_url');
    const localKey = localStorage.getItem('index_motors_supabase_key');
    if (localUrl && localKey && localUrl.startsWith('https://')) {
      return { url: localUrl, key: localKey, source: 'local' };
    }
  } catch (e) {
    // ignore
  }

  return { url: null, key: null, source: null };
};

export const saveCloudCredentials = (url, key) => {
  localStorage.setItem('index_motors_supabase_url', url.trim());
  localStorage.setItem('index_motors_supabase_key', key.trim());
  supabase = initSupabaseClient();
  return supabase;
};

export const clearCloudCredentials = () => {
  localStorage.removeItem('index_motors_supabase_url');
  localStorage.removeItem('index_motors_supabase_key');
  supabase = initSupabaseClient();
};

export const isSupabaseConfigured = () => {
  const { url, key } = getCloudCredentials();
  return Boolean(url && key);
};

export const initSupabaseClient = () => {
  const { url, key } = getCloudCredentials();
  if (!url || !key) return null;
  try {
    return createClient(url, key, {
      realtime: {
        params: {
          eventsPerSecond: 10,
        },
      },
      auth: {
        persistSession: false,
      },
    });
  } catch (e) {
    console.warn('Failed to initialize Supabase client:', e);
    return null;
  }
};

export let supabase = initSupabaseClient();

/**
 * Test connectivity and table existence with provided or active credentials.
 */
export const testCloudConnection = async (testUrl, testKey) => {
  const url = testUrl || getCloudCredentials().url;
  const key = testKey || getCloudCredentials().key;

  if (!url || !key) {
    return { success: false, error: 'Supabase URL and Anon Key are required.' };
  }

  try {
    const client = createClient(url, key, { auth: { persistSession: false } });
    const { data, error } = await client.from('tasks').select('id').limit(1);

    if (error) {
      if (error.code === '42P01' || error.message?.toLowerCase().includes('does not exist')) {
        return { 
          success: false, 
          error: 'Connected to Supabase, but tables are missing! Please run the SQL query from supabase_schema.sql in Supabase SQL Editor.' 
        };
      }
      return { success: false, error: error.message };
    }

    return { success: true, count: data?.length || 0 };
  } catch (err) {
    return { success: false, error: err.message || 'Network connection failed' };
  }
};

/**
 * Fetch all records for a table from Supabase with a 7-second timeout.
 */
export const fetchCloudTable = async (tableName) => {
  if (!supabase) return null;
  try {
    const timeoutPromise = new Promise((_, reject) => 
      setTimeout(() => reject(new Error(`Timeout fetching ${tableName}`)), 7000)
    );

    const fetchPromise = supabase.from(tableName).select('*');
    const response = await Promise.race([fetchPromise, timeoutPromise]);
    const { data, error } = response;

    if (error) {
      console.warn(`Supabase fetch failed for ${tableName}:`, error.message);
      return null;
    }
    // Unwrap JSON fields if stored as JSONB rows
    return data.map(row => (row.data ? { ...row.data, id: row.id } : row));
  } catch (err) {
    console.warn(`Supabase network error on ${tableName}:`, err.message || err);
    return null;
  }
};

/**
 * Upsert a record to Supabase cloud table.
 */
export const upsertCloudRecord = async (tableName, id, record) => {
  if (!supabase) return false;
  try {
    const payload = {
      id: String(id),
      data: record,
      updated_at: new Date().toISOString(),
    };
    const { error } = await supabase.from(tableName).upsert(payload);
    if (error) {
      console.warn(`Supabase upsert failed for ${tableName}:`, error.message);
      return false;
    }
    return true;
  } catch (err) {
    console.warn(`Supabase error saving to ${tableName}:`, err);
    return false;
  }
};

/**
 * Delete a record from Supabase cloud table.
 */
export const deleteCloudRecord = async (tableName, id) => {
  if (!supabase) return false;
  try {
    const { error } = await supabase.from(tableName).delete().eq('id', String(id));
    if (error) {
      console.warn(`Supabase delete failed for ${tableName}:`, error.message);
      return false;
    }
    return true;
  } catch (err) {
    console.warn(`Supabase error deleting from ${tableName}:`, err);
    return false;
  }
};

/**
 * Real-time listener: Subscribe to database changes across all other devices.
 */
export const subscribeToCloudChanges = (onDataChange) => {
  if (!supabase) return () => {};

  const channel = supabase
    .channel('index-motors-realtime-channel')
    .on(
      'postgres_changes',
      { event: '*', schema: 'public' },
      (payload) => {
        console.log(`[Realtime Sync] Change in ${payload.table}:`, payload);
        onDataChange(payload);
      }
    )
    .subscribe();

  return () => {
    try {
      supabase.removeChannel(channel);
    } catch (e) {
      // ignore
    }
  };
};

/**
 * Fast batch seeding: Populates cloud database in 1 single HTTP request per table.
 */
export const seedCloudIfEmpty = async (state) => {
  if (!supabase) return;
  try {
    const { data: existingTasks, error } = await supabase.from('tasks').select('id').limit(1);
    if (error) {
      console.warn('Could not query tasks table for auto-seed:', error.message);
      return;
    }

    if (!existingTasks || existingTasks.length === 0) {
      console.log('Cloud database is empty. Fast batch-seeding initial data to Supabase...');
      
      const prepareBatch = (items) => (items || []).map(item => ({
        id: String(item.id),
        data: item,
        updated_at: new Date().toISOString()
      }));

      await Promise.allSettled([
        state.tasks?.length ? supabase.from('tasks').upsert(prepareBatch(state.tasks)) : null,
        state.invoices?.length ? supabase.from('invoices').upsert(prepareBatch(state.invoices)) : null,
        state.sales?.length ? supabase.from('sales').upsert(prepareBatch(state.sales)) : null,
        state.expenses?.length ? supabase.from('expenses').upsert(prepareBatch(state.expenses)) : null,
        state.trucks?.length ? supabase.from('trucks').upsert(prepareBatch(state.trucks)) : null,
        state.customers?.length ? supabase.from('customers').upsert(prepareBatch(state.customers)) : null,
        state.technicians?.length ? supabase.from('technicians').upsert(prepareBatch(state.technicians)) : null,
        state.profile ? supabase.from('profile').upsert({ id: 'main', data: state.profile, updated_at: new Date().toISOString() }) : null,
      ]);
      console.log('Batch seeding complete!');
    }
  } catch (err) {
    console.warn('Auto-seed check failed:', err);
  }
};
