const { createClient } = require('@supabase/supabase-js');
const {
  initialTrucks,
  initialCustomers,
  initialTasks,
  initialSalesDeals,
  initialTechnicians,
  initialCompanyProfile,
  initialUsers,
  initialExpenses,
  initialInvoices
} = require('../src/data/initialData.js');

const SUPABASE_URL = 'https://peatgecyrwuylgatjcdj.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBlYXRnZWN5cnd1eWxnYXRqY2RqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTIyMzk0NzcsImV4cCI6MjEwNzgxNTQ3N30.CNMdgYcEm5lGrP2PMO60t47mePK9TnHLLo2Zhu2lW4w';

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

async function syncAll() {
  console.log('--- STARTING COMPREHENSIVE SUPABASE CLOUD RE-SEED ---');

  const tablesToFreshSync = [
    { name: 'trucks', items: initialTrucks },
    { name: 'customers', items: initialCustomers },
    { name: 'tasks', items: initialTasks },
    { name: 'sales', items: initialSalesDeals },
    { name: 'technicians', items: initialTechnicians },
    { name: 'expenses', items: initialExpenses },
    { name: 'invoices', items: initialInvoices },
    { name: 'users', items: initialUsers }
  ];

  for (const t of tablesToFreshSync) {
    console.log(`Processing table: ${t.name}...`);
    // Delete existing old rows
    const { error: delError } = await supabase.from(t.name).delete().neq('id', '___NEVER_MATCH___');
    if (delError) {
      console.warn(`  Warning deleting from ${t.name}:`, delError.message);
    } else {
      console.log(`  Cleared old records from ${t.name}`);
    }

    // Insert new data
    const batch = t.items.map(item => ({
      id: String(item.id),
      data: item,
      updated_at: new Date().toISOString()
    }));

    if (batch.length > 0) {
      const { data, error: insError } = await supabase.from(t.name).upsert(batch);
      if (insError) {
        console.error(`  Error inserting into ${t.name}:`, insError.message);
      } else {
        console.log(`  Successfully inserted ${batch.length} fresh records into ${t.name}`);
      }
    }
  }

  // Profile
  console.log('Processing company profile...');
  await supabase.from('profile').upsert({
    id: 'main',
    data: initialCompanyProfile,
    updated_at: new Date().toISOString()
  });
  console.log('  Company profile updated to Index Motors SML & Tata');

  console.log('--- SUPABASE CLOUD DATABASE SYNC COMPLETE ---');
}

syncAll().catch(err => {
  console.error('Fatal sync error:', err);
  process.exit(1);
});
