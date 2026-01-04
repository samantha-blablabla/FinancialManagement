const fs = require('fs');
const { exec } = require('child_process');

console.log('🚀 Opening Supabase SQL Editor for migration...\n');

// Read the migration file
const migrationSql = fs.readFileSync('supabase/migrations/007_multi_currency_support.sql', 'utf8');

// Write to a temp file that can be easily copied
const tempFile = 'migration-to-run.sql';
fs.writeFileSync(tempFile, migrationSql);

console.log(`✅ Migration SQL saved to: ${tempFile}`);
console.log('\n📋 SQL Content:\n');
console.log('═'.repeat(70));
console.log(migrationSql);
console.log('═'.repeat(70));

// Try to copy to clipboard (Windows)
try {
  exec(`echo ${migrationSql.replace(/"/g, '\\"').replace(/\n/g, ' ')} | clip`, (error) => {
    if (error) {
      console.log('\n⚠️  Could not copy to clipboard automatically');
    } else {
      console.log('\n✅ SQL copied to clipboard!');
    }
  });
} catch (e) {
  console.log('\n⚠️  Could not copy to clipboard');
}

// Open Supabase SQL Editor
const url = 'https://supabase.com/dashboard/project/emrkibqfkjjwpupqfger/sql/new';
console.log(`\n🔗 Opening: ${url}`);

exec(`start ${url}`, (error) => {
  if (error) {
    console.log(`\n⚠️  Could not open browser automatically. Please visit:\n${url}`);
  } else {
    console.log('\n✅ Browser opened!');
  }
});

console.log('\n📝 Instructions:');
console.log('1. The SQL has been copied to your clipboard');
console.log('2. Paste it into the Supabase SQL Editor');
console.log('3. Click "Run" to execute the migration');
console.log('\nOR manually copy from the file: migration-to-run.sql\n');
