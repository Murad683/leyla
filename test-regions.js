const { Client } = require('pg');

const regions = [
  'ap-southeast-1', // Singapore
  'ap-southeast-2', // Sydney
  'ap-northeast-1', // Tokyo
  'ap-northeast-2', // Seoul
  'ap-south-1',     // Mumbai
  'eu-central-1',   // Frankfurt
  'eu-west-1',      // Ireland
  'us-east-1',      // N. Virginia
  'us-west-1'       // N. California
];

async function testRegion(region) {
  const host = `aws-0-${region}.pooler.supabase.com`;
  // No sslmode in connectionString to prevent override
  const connectionString = `postgresql://postgres.qqvcnoyqpxmclrabjsyv:8%256kS*4E-F%235Q%40c@${host}:6543/postgres`;
  const client = new Client({
    connectionString,
    ssl: { rejectUnauthorized: false }
  });
  
  try {
    console.log(`Testing ${region}...`);
    await client.connect();
    console.log(`\n🎉 SUCCESS! Connected to region: ${region}\n`);
    await client.end();
    return true;
  } catch (err) {
    console.log(`Failed for ${region}: ${err.message}`);
    return false;
  }
}

async function run() {
  for (const region of regions) {
    const success = await testRegion(region);
    if (success) {
      process.exit(0);
    }
  }
  console.log('All regions failed.');
}

run();
