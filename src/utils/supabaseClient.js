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
  ? createClient(supabaseUrl, supabaseAnonKey)
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
