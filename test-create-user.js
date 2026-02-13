
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.migration' });

async function testCreate() {
    const local = createClient(process.env.LOCAL_SUPABASE_URL, process.env.LOCAL_SUPABASE_SERVICE_KEY);
    const id = 'e9c63482-4e19-4dc3-9223-c020b8e42f0e';
    const email = 'krissshado+slywish@gmail.com';

    console.log(`Trying to create user ${email} with ID ${id}...`);
    const { data, error } = await local.auth.admin.createUser({
        id: id,
        email: email,
        password: 'password123',
        email_confirm: true
    });

    if (error) console.log('Error:', error.message);
    else console.log('Success:', data.user.id);
}
testCreate();
