
const { createClient } = require('@supabase/supabase-js');
const dotenv = require('dotenv');
dotenv.config({ path: '.env.migration' });

const CLOUD_URL = process.env.CLOUD_SUPABASE_URL;
const CLOUD_KEY = process.env.CLOUD_SUPABASE_SERVICE_KEY;
const LOCAL_URL = process.env.LOCAL_SUPABASE_URL;
const LOCAL_KEY = process.env.LOCAL_SUPABASE_SERVICE_KEY;

async function check() {
    console.log('--- CLOUD ---');
    console.log('URL:', CLOUD_URL);
    const cloud = createClient(CLOUD_URL, CLOUD_KEY);

    try {
        const { data: cProfiles, error: cError } = await cloud.from('profiles').select('count', { count: 'exact', head: true });
        console.log('Cloud Profiles Check:', cError ? `Error: ${cError.message} (${cError.code})` : 'OK');

        const { data: cUsers, error: cuError } = await cloud.auth.admin.listUsers();
        console.log('Cloud Auth Check:', cuError ? `Error: ${cuError.message}` : `OK (${cUsers.users.length} users)`);
    } catch (e) {
        console.log('Cloud Catch Error:', e.message);
    }

    console.log('\n--- LOCAL ---');
    console.log('URL:', LOCAL_URL);
    const local = createClient(LOCAL_URL, LOCAL_KEY);

    try {
        const { data: lProfiles, error: lError } = await local.from('profiles').select('count', { count: 'exact', head: true });
        console.log('Local Profiles Check:', lError ? `Error: ${lError.message} (${lError.code})` : 'OK');

        const { data: lUsers, error: luError } = await local.auth.admin.listUsers();
        console.log('Local Auth Check:', luError ? `Error: ${luError.message}` : `OK (${lUsers.users.length} users)`);
    } catch (e) {
        console.log('Local Catch Error:', e.message);
    }
}

check();
