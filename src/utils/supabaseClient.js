import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const isSupabaseConfigured = () => {
  return Boolean(
    supabaseUrl && 
    supabaseAnonKey && 
    supabaseUrl.startsWith('https://') &&
    !supabaseUrl.includes('your-project-id')
  );
};

export const supabase = isSupabaseConfigured()
  ? createClient(supabaseUrl, supabaseAnonKey, {
      realtime: {
        params: {
          eventsPerSecond: 10,
        },
      },
    })
  : null;

/**
 * Fetch all records for a table from Supabase.
 * Returns null if Supabase is not configured or if query fails.
 */
export const fetchCloudTable = async (tableName) => {
  if (!supabase) return null;
  try {
    const { data, error } = await supabase.from(tableName).select('*');
    if (error) {
      console.warn(`Supabase fetch failed for ${tableName}:`, error.message);
      return null;
    }
    // Unwrap JSON fields if stored as JSONB rows
    return data.map(row => (row.data ? { ...row.data, id: row.id } : row));
  } catch (err) {
    console.warn(`Supabase network error on ${tableName}:`, err);
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
 * Calls onDataChange callback whenever any device inserts, updates, or deletes.
 */
export const subscribeToCloudChanges = (onDataChange) => {
  if (!supabase) return () => {};

  const channel = supabase
    .channel('index-motors-realtime-channel')
    .on(
      'postgres_changes',
      { event: '*', schema: 'public' },
      (payload) => {
        console.log(`[Realtime Sync] Change detected in ${payload.table} from another device:`, payload);
        onDataChange(payload);
      }
    )
    .subscribe((status) => {
      console.log('[Realtime Sync Status]:', status);
    });

  return () => {
    supabase.removeChannel(channel);
  };
};

/**
 * Automatically seeds the cloud database if tables are empty.
 * Ensures the first device to connect populates the database so any other device gets full data.
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
      console.log('Cloud database is empty. Auto-seeding initial data to Supabase...');
      if (state.tasks?.length) {
        for (const t of state.tasks) await upsertCloudRecord('tasks', t.id, t);
      }
      if (state.invoices?.length) {
        for (const i of state.invoices) await upsertCloudRecord('invoices', i.id, i);
      }
      if (state.sales?.length) {
        for (const s of state.sales) await upsertCloudRecord('sales', s.id, s);
      }
      if (state.trucks?.length) {
        for (const trk of state.trucks) await upsertCloudRecord('trucks', trk.id, trk);
      }
      if (state.customers?.length) {
        for (const c of state.customers) await upsertCloudRecord('customers', c.id, c);
      }
      if (state.technicians?.length) {
        for (const tech of state.technicians) await upsertCloudRecord('technicians', tech.id, tech);
      }
      if (state.profile) {
        await upsertCloudRecord('profile', 'main', state.profile);
      }
      console.log('Cloud database auto-seed complete!');
    }
  } catch (err) {
    console.warn('Auto-seed check failed:', err);
  }
};
