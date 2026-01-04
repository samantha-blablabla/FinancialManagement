const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');

const supabase = createClient(
  'https://emrkibqfkjjwpupqfger.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVtcmtpYnFma2pqd3B1cHFmZ2VyIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2NzQ4ODQyNywiZXhwIjoyMDgzMDY0NDI3fQ.l6hxwisxNMDIAkF09hEmCqAUokaNT7rmp4tNq2Xgi_8',
  {
    db: {
      schema: 'public'
    }
  }
);

async function runMigration() {
  console.log('🚀 Running migration 007_multi_currency_support.sql...\n');

  const statements = [
    {
      name: 'Add currencies column to spaces',
      sql: `ALTER TABLE spaces ADD COLUMN IF NOT EXISTS currencies TEXT[] DEFAULT ARRAY['VND'];`
    },
    {
      name: 'Migrate existing currency data',
      sql: `UPDATE spaces SET currencies = ARRAY[currency] WHERE currency IS NOT NULL AND currencies = ARRAY['VND'];`
    },
    {
      name: 'Set default for NULL currencies',
      sql: `UPDATE spaces SET currencies = ARRAY['VND'] WHERE currency IS NULL;`
    },
    {
      name: 'Add currency column to transactions',
      sql: `ALTER TABLE transactions ADD COLUMN IF NOT EXISTS currency TEXT DEFAULT 'VND';`
    },
    {
      name: 'Migrate transaction currencies',
      sql: `UPDATE transactions t SET currency = s.currencies[1] FROM spaces s WHERE t.space_id = s.id AND t.currency = 'VND';`
    },
    {
      name: 'Create index on transactions.currency',
      sql: `CREATE INDEX IF NOT EXISTS idx_transactions_currency ON transactions(currency);`
    },
    {
      name: 'Create index on transactions(space_id, currency)',
      sql: `CREATE INDEX IF NOT EXISTS idx_transactions_space_currency ON transactions(space_id, currency);`
    }
  ];

  let successCount = 0;
  let errorCount = 0;

  for (let i = 0; i < statements.length; i++) {
    const { name, sql } = statements[i];
    console.log(`[${i + 1}/${statements.length}] ${name}...`);

    try {
      // Use raw SQL query through the REST API
      const { data, error } = await supabase.rpc('exec_sql', { query: sql });

      if (error) {
        // Try alternative method - direct table operations for some statements
        if (sql.includes('ALTER TABLE')) {
          console.log('  ⚠️  Cannot execute DDL via RPC (this is normal)');
          console.log('  💡 Please run this in Supabase SQL Editor manually');
          errorCount++;
        } else {
          console.log('  ❌ Error:', error.message);
          errorCount++;
        }
      } else {
        console.log('  ✅ Success');
        successCount++;
      }
    } catch (err) {
      console.log('  ⚠️  Error:', err.message);
      errorCount++;
    }

    console.log('');
  }

  console.log('═'.repeat(60));
  console.log(`Migration completed: ${successCount} succeeded, ${errorCount} need manual execution`);
  console.log('═'.repeat(60));

  if (errorCount > 0) {
    console.log('\n📝 To complete migration, copy and paste this into Supabase SQL Editor:');
    console.log('\n' + '─'.repeat(60));
    console.log(fs.readFileSync('supabase/migrations/007_multi_currency_support.sql', 'utf8'));
    console.log('─'.repeat(60));
    console.log('\n🔗 Go to: https://supabase.com/dashboard/project/emrkibqfkjjwpupqfger/sql/new');
  }
}

runMigration().catch(err => {
  console.error('Fatal error:', err);
  process.exit(1);
});
