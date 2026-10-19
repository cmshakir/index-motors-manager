import { createClient } from '@supabase/supabase-js';

// Default Index Motors Supabase Cloud Project (Auto-connects on mobile, PC, and all devices)
const DEFAULT_SUPABASE_URL = 'https://peatgecyrwuylgatjcdj.supabase.co';
const DEFAULT_SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBlYXRnZWN5cnd1eWxnYXRqY2RqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTIyMzk0NzcsImV4cCI6MjEwNzgxNTQ3N30.CNMdgYcEm5lGrP2PMO60t47mePK9TnHLLo2Zhu2lW4w';

// Retrieve credentials from Vite env, user-saved localStorage, or default project
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

  if (DEFAULT_SUPABASE_URL && DEFAULT_SUPABASE_ANON_KEY) {
    return { url: DEFAULT_SUPABASE_URL, key: DEFAULT_SUPABASE_ANON_KEY, source: 'default' };
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
    
    // Check all 9 application tables
    const requiredTables = ['tasks', 'invoices', 'sales', 'expenses', 'trucks', 'customers', 'technicians', 'users', 'profile'];
    const missingTables = [];

    for (const table of requiredTables) {
      const { error } = await client.from(table).select('id').limit(1);
      if (error) {
        if (error.code === '42P01' || error.message?.toLowerCase().includes('does not exist') || error.code === 'PGRST204' || error.code === 'PGRST205') {
          missingTables.push(table);
        }
      }
    }

    if (missingTables.length > 0) {
      return { 
        success: false, 
        error: `Supabase connected, but missing table(s): "${missingTables.join(', ')}". Please copy and run the SQL query in Supabase SQL Editor.` 
      };
    }

    return { success: true };
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

// Active Realtime Channel and Local Broadcast Channel
let activeRealtimeChannel = null;
export const localBroadcast = typeof window !== 'undefined' && 'BroadcastChannel' in window 
  ? new BroadcastChannel('index_motors_local_sync') 
  : null;

/**
 * Upsert a record to Supabase cloud table with status reporting and instant broadcast.
 */
export const upsertCloudRecord = async (tableName, id, record) => {
  // Broadcast locally to any other open tabs/windows immediately
  if (localBroadcast) {
    try {
      localBroadcast.postMessage({ table: tableName, id: String(id), data: record, eventType: 'UPSERT', time: Date.now() });
    } catch (e) {
      // ignore
    }
  }

  if (!supabase) {
    return { success: false, notConfigured: true, error: 'Database not connected on this device' };
  }
  try {
    const payload = {
      id: String(id),
      data: record,
      updated_at: new Date().toISOString(),
    };
    const { error } = await supabase.from(tableName).upsert(payload);
    if (error) {
      console.warn(`Supabase upsert failed for ${tableName}:`, error.message);
      return { success: false, error: error.message };
    }

    // Instant WebSocket broadcast to other devices connected to Supabase
    if (activeRealtimeChannel) {
      try {
        activeRealtimeChannel.send({
          type: 'broadcast',
          event: 'data_changed',
          payload: { table: tableName, id: String(id), data: record, eventType: 'INSERT', time: Date.now() }
        });
      } catch (e) {
        // ignore
      }
    }

    return { success: true };
  } catch (err) {
    console.warn(`Supabase error saving to ${tableName}:`, err);
    return { success: false, error: err.message || 'Network error' };
  }
};

/**
 * Delete a record from Supabase cloud table with instant broadcast.
 */
export const deleteCloudRecord = async (tableName, id) => {
  if (localBroadcast) {
    try {
      localBroadcast.postMessage({ table: tableName, id: String(id), eventType: 'DELETE', time: Date.now() });
    } catch (e) {
      // ignore
    }
  }

  if (!supabase) return { success: false, notConfigured: true };
  try {
    const { error } = await supabase.from(tableName).delete().eq('id', String(id));
    if (error) {
      console.warn(`Supabase delete failed for ${tableName}:`, error.message);
      return { success: false, error: error.message };
    }

    if (activeRealtimeChannel) {
      try {
        activeRealtimeChannel.send({
          type: 'broadcast',
          event: 'data_changed',
          payload: { table: tableName, id: String(id), eventType: 'DELETE', time: Date.now() }
        });
      } catch (e) {
        // ignore
      }
    }

    return { success: true };
  } catch (err) {
    console.warn(`Supabase error deleting from ${tableName}:`, err);
    return { success: false, error: err.message || 'Network error' };
  }
};

/**
 * Real-time listener: Subscribe to database changes across all other devices.
 * Uses both PostgreSQL replication changes and instant WebSocket broadcasts across all 9 tables.
 */
export const subscribeToCloudChanges = (onDataChange) => {
  // Listen to local cross-tab broadcast
  if (localBroadcast) {
    localBroadcast.onmessage = (event) => {
      if (event?.data) {
        onDataChange(event.data);
      }
    };
  }

  if (!supabase) return () => {};

  const tables = ['tasks', 'invoices', 'sales', 'expenses', 'trucks', 'customers', 'technicians', 'profile', 'users'];
  
  let channel = supabase.channel('index-motors-realtime-hub', {
    config: {
      broadcast: { self: false }
    }
  });

  // 1. Listen for instant broadcasts from other devices
  channel = channel.on('broadcast', { event: 'data_changed' }, (payload) => {
    console.log('[Realtime Broadcast] Instant change received:', payload);
    if (payload?.payload) {
      onDataChange(payload.payload);
    }
  });

  // 2. Listen for PostgreSQL replication changes on each table
  for (const tbl of tables) {
    channel = channel.on(
      'postgres_changes',
      { event: '*', schema: 'public', table: tbl },
      (payload) => {
        console.log(`[Realtime Postgres] Change in ${tbl}:`, payload);
        onDataChange({
          table: tbl,
          eventType: payload.eventType,
          new: payload.new,
          old: payload.old
        });
      }
    );
  }

  channel.subscribe((status) => {
    console.log(`[Realtime Subscription Status]: ${status}`);
  });

  activeRealtimeChannel = channel;

  return () => {
    try {
      if (activeRealtimeChannel) {
        supabase.removeChannel(activeRealtimeChannel);
        activeRealtimeChannel = null;
      }
    } catch (e) {
      // ignore
    }
  };
};

/**
 * Table-by-table intelligent seeding: Populates empty tables with default dealership data.
 */
export const seedCloudIfEmpty = async (state) => {
  if (!supabase) return;
  try {
    const prepareBatch = (items) => (items || []).map(item => ({
      id: String(item.id),
      data: item,
      updated_at: new Date().toISOString()
    }));

    const tablesToCheck = [
      { name: 'tasks', data: state.tasks },
      { name: 'invoices', data: state.invoices },
      { name: 'sales', data: state.sales },
      { name: 'expenses', data: state.expenses },
      { name: 'trucks', data: state.trucks },
      { name: 'customers', data: state.customers },
      { name: 'technicians', data: state.technicians },
      { name: 'users', data: state.users },
    ];

    for (const t of tablesToCheck) {
      if (!t.data || t.data.length === 0) continue;
      try {
        const { data: existing, error } = await supabase.from(t.name).select('id').limit(1);
        if (!error && (!existing || existing.length === 0)) {
          console.log(`[Auto-Seed] Seeding empty table '${t.name}' with initial records...`);
          await supabase.from(t.name).upsert(prepareBatch(t.data));
        }
      } catch (e) {
        console.warn(`[Auto-Seed] Could not check or seed table ${t.name}:`, e);
      }
    }

    // Profile check
    if (state.profile) {
      try {
        const { data: existingProf, error: pErr } = await supabase.from('profile').select('id').limit(1);
        if (!pErr && (!existingProf || existingProf.length === 0)) {
          await supabase.from('profile').upsert({ id: 'main', data: state.profile, updated_at: new Date().toISOString() });
        }
      } catch (err) {
        // ignore
      }
    }
  } catch (err) {
    console.warn('[Auto-Seed] Error checking tables:', err);
  }
};
