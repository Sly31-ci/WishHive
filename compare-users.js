
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.migration' });

async function compare() {
    console.log('Env URL:', process.env.LOCAL_SUPABASE_URL);
    const cloud = createClient(process.env.CLOUD_SUPABASE_URL, process.env.CLOUD_SUPABASE_SERVICE_KEY);
    const local = createClient(process.env.LOCAL_SUPABASE_URL, process.env.LOCAL_SUPABASE_SERVICE_KEY);

    console.log('--- CLOUD USERS ---');
    const { data: cData, error: cErr } = await cloud.auth.admin.listUsers();
    if (cErr) console.log('Cloud Error:', cErr.message);
    else cData.users.forEach(u => console.log(`- ${u.id}: ${u.email}`));

    console.log('\n--- LOCAL USERS ---');
    const { data: lData, error: lErr } = await local.auth.admin.listUsers();
    if (lErr) console.log('Local Error:', lErr.message);
    else lData.users.forEach(u => console.log(`- ${u.id}: ${u.email}`));
}
compare();
