# How to Check Your Supabase Configuration

## 1. Verify You're Using the Service Role Key

### Where to Find the Service Role Key:

1. Go to your Supabase Dashboard
2. Click on **Settings** (gear icon in bottom left)
3. Click on **API** in the left sidebar
4. Look for the section labeled **Project API keys**
5. You'll see two keys:
   - `anon` / `public` - This is for frontend (NOT for backend!)
   - `service_role` - This is for backend (This is what you need!)

### Key Characteristics:

- **Anon Key**: Usually starts with `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6...` and if you decode it (jwt.io), the `role` field says `anon`
- **Service Role Key**: Also starts with `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6...` but if you decode it, the `role` field says `service_role`

## 2. Check Your Backend .env File

Your `backend/.env` file should look like:

```env
PORT=3000
SUPABASE_URL=https://abcdefghijklmnop.supabase.co
SUPABASE_KEY=eyJhbGc...your-service-role-key-here
```

**IMPORTANT**: The `SUPABASE_KEY` should be the **service_role** key, NOT the anon key!

## 3. Verify in Your Terminal

When you start your backend server, you should now see:

```
✅ Supabase client initialized
📍 URL: https://your-project.supabase.co
🔑 Key type: eyJhbGciOiJIUzI1NiIsI...
```

### Decode Your Key to Check:

1. Copy your SUPABASE_KEY from the .env file
2. Go to https://jwt.io/
3. Paste your key in the "Encoded" section
4. Look at the decoded payload - it should have:
   ```json
   {
     "role": "service_role",
     ...
   }
   ```
5. If it says `"role": "anon"`, you're using the WRONG key!

## 4. Quick Test Script

Create a file `backend/test-supabase.js`:

```javascript
import { getSupabaseClient } from './clients/supabaseClient.js';
import dotenv from 'dotenv';

dotenv.config();

async function testSupabase() {
  console.log('Testing Supabase connection...\n');
  
  // Check environment variables
  console.log('Environment Variables:');
  console.log('SUPABASE_URL:', process.env.SUPABASE_URL ? '✅ Set' : '❌ Not set');
  console.log('SUPABASE_KEY:', process.env.SUPABASE_KEY ? '✅ Set' : '❌ Not set');
  
  if (process.env.SUPABASE_KEY) {
    const keyStart = process.env.SUPABASE_KEY.substring(0, 50);
    console.log('Key starts with:', keyStart + '...\n');
  }
  
  try {
    const supabase = getSupabaseClient();
    
    // Try to query profiles table
    console.log('Testing database access...');
    const { data, error } = await supabase.from('profiles').select('count');
    
    if (error) {
      console.error('❌ Error querying database:', error);
    } else {
      console.log('✅ Database connection successful!');
      console.log('Profiles table accessible:', data);
    }
    
    // Try to query profile_roles table
    console.log('\nTesting profile_roles access...');
    const { data: rolesData, error: rolesError } = await supabase
      .from('profile_roles')
      .select('count');
    
    if (rolesError) {
      console.error('❌ Error querying profile_roles:', rolesError);
    } else {
      console.log('✅ profile_roles table accessible!');
      console.log('Roles data:', rolesData);
    }
    
  } catch (err) {
    console.error('❌ Fatal error:', err.message);
  }
}

testSupabase();
```

Run it:
```bash
cd backend
node test-supabase.js
```

## 5. Common Issues and Solutions

### Issue 1: "Row violates row-level security policy"

**Cause**: You're using the anon key instead of service role key

**Solution**: 
1. Get the service_role key from Supabase Dashboard → Settings → API
2. Update your `backend/.env` file with the correct key
3. Restart your backend server

### Issue 2: "Could not find column 'first_name'"

**Cause**: The profiles table doesn't have the required columns

**Solution**: 
1. Run the `QUICK_FIX_RLS.sql` script in Supabase SQL Editor
2. Verify columns were added:
   ```sql
   SELECT column_name FROM information_schema.columns 
   WHERE table_name = 'profiles';
   ```

### Issue 3: Backend still failing after correct key

**Cause**: SQL policies weren't applied correctly

**Solution**:
1. Run `QUICK_FIX_RLS.sql` script
2. Verify policies with:
   ```sql
   SELECT tablename, policyname, roles 
   FROM pg_policies 
   WHERE tablename = 'profile_roles';
   ```
3. Should see `service_role_all_profile_roles` policy

## 6. Final Checklist

- [ ] I've found the **service_role** key in Supabase Dashboard → Settings → API
- [ ] I've updated `backend/.env` with the service_role key (not anon key)
- [ ] I've run the `QUICK_FIX_RLS.sql` script in Supabase SQL Editor
- [ ] I've verified the profiles table has `first_name` and `last_name` columns
- [ ] I've verified RLS policies exist for service_role
- [ ] I've restarted my backend server
- [ ] I see "✅ Supabase client initialized" in backend console

## 7. Still Not Working?

If you've done all of the above and it's still not working:

1. **Temporarily disable RLS** (for testing only):
   ```sql
   ALTER TABLE public.profile_roles DISABLE ROW LEVEL SECURITY;
   ALTER TABLE public.profiles DISABLE ROW LEVEL SECURITY;
   ```

2. **Try registration again** - if it works now, the issue is definitely with RLS policies

3. **Re-enable RLS** and apply correct policies:
   ```sql
   ALTER TABLE public.profile_roles ENABLE ROW LEVEL SECURITY;
   ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
   ```

4. **Re-run the QUICK_FIX_RLS.sql script**

## Need Help?

Share these outputs:
1. The first 50 characters of your SUPABASE_KEY (from .env)
2. The decoded JWT payload from jwt.io (check the `role` field)
3. The output of the test script
4. The result of: `SELECT * FROM pg_policies WHERE tablename = 'profile_roles';`

