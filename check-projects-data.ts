/**
 * DIAGNOSTIC SCRIPT: Check what data exists in Supabase projects table
 * Run: npx ts-node check-projects-data.ts
 */
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env') });

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_PUBLISHABLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Missing Supabase credentials in .env');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function diagnose() {
  console.log('🔍 DIAGNOSING PROJECT IMAGE PIPELINE\n');
  console.log('='.repeat(60));
  
  try {
    // 1. Check table structure
    console.log('\n1️⃣  CHECKING PROJECTS TABLE STRUCTURE:');
    const { data: columns, error: structError } = await supabase
      .rpc('query_columns', {
        p_table: 'projects',
        p_schema: 'public'
      })
      .catch(() => ({ data: null, error: 'RPC not available' }));

    if (structError) {
      console.log('   ⚠️  Could not query table structure:', structError);
      console.log('   ℹ️  Expected columns: id, title, description, category, media_url, media_type, created_at');
    } else {
      console.log('   ✅ Table structure:', columns);
    }

    // 2. Fetch all projects
    console.log('\n2️⃣  FETCHING ALL PROJECTS FROM SUPABASE:');
    const { data: projects, error: fetchError } = await supabase
      .from('projects')
      .select('*')
      .order('created_at', { ascending: false });

    if (fetchError) {
      console.error('   ❌ ERROR:', fetchError.message);
      process.exit(1);
    }

    if (!projects || projects.length === 0) {
      console.log('   ⚠️  NO PROJECTS FOUND IN DATABASE!');
      console.log('\n   This is the ROOT CAUSE: The projects table is empty.');
      console.log('   Projects need to be added via the admin panel or database.');
    } else {
      console.log(`   ✅ Found ${projects.length} project(s)\n`);

      // 3. Analyze each project
      projects.forEach((proj, idx) => {
        console.log(`\n   PROJECT ${idx + 1}: "${proj.title}"`);
        console.log(`   ├─ ID: ${proj.id}`);
        console.log(`   ├─ Category: ${proj.category}`);
        console.log(`   ├─ Media URL: ${proj.media_url || '❌ MISSING/NULL'}`);
        console.log(`   ├─ Media Type: ${proj.media_type || 'image'}`);
        console.log(`   ├─ Created: ${proj.created_at}`);
        
        // Check if URL is valid
        if (proj.media_url) {
          const url = proj.media_url;
          console.log(`   └─ URL Analysis:`);
          
          if (url.includes('cloudinary.com')) {
            console.log(`      ✅ URL is Cloudinary URL`);
            console.log(`         ${url.substring(0, 80)}...`);
          } else if (url.includes('drive.google.com')) {
            console.log(`      ℹ️  URL is Google Drive (needs to be publicly accessible)`);
            console.log(`         ${url.substring(0, 80)}...`);
          } else if (url.includes('unsplash.com')) {
            console.log(`      ✅ URL is Unsplash (public image service)`);
          } else if (url.startsWith('http')) {
            console.log(`      ℹ️  URL is external: ${url.substring(0, 80)}...`);
          } else {
            console.log(`      ❌ URL format unclear: ${url.substring(0, 80)}...`);
          }
        }
      });

      // 4. Cloudinary verification
      console.log('\n3️⃣  CLOUDINARY CONFIGURATION:');
      const cloudName = process.env.VITE_CLOUDINARY_CLOUD_NAME;
      const apiKey = process.env.VITE_CLOUDINARY_API_KEY;
      console.log(`   ├─ Cloud Name: ${cloudName || '❌ MISSING'}`);
      console.log(`   ├─ API Key: ${apiKey ? '✅ Configured' : '❌ MISSING'}`);

      // 5. Summary
      console.log('\n' + '='.repeat(60));
      console.log('\n📊 SUMMARY:');
      
      const projectsWithImages = projects.filter(p => p.media_url);
      const projectsWithoutImages = projects.filter(p => !p.media_url);
      
      console.log(`   ✅ Projects with images: ${projectsWithImages.length}/${projects.length}`);
      console.log(`   ❌ Projects without images: ${projectsWithoutImages.length}/${projects.length}`);
      
      if (projectsWithoutImages.length > 0) {
        console.log('\n   🔴 ROOT CAUSE IDENTIFIED:');
        console.log('      Some or all projects have empty/null media_url values.');
        console.log('      Images need to be uploaded via the admin panel.');
      } else if (projects.length > 0 && projectsWithImages.length === projects.length) {
        console.log('\n   ✅ All projects have image URLs.');
        console.log('      The issue might be with URL access/CORS/availability.');
      }
    }

  } catch (err) {
    console.error('❌ Unexpected error:', err);
  }

  console.log('\n' + '='.repeat(60));
  console.log('\nℹ️  Next steps:');
  console.log('   1. If no projects found → Add projects via admin panel');
  console.log('   2. If images are null → Upload images via admin panel');
  console.log('   3. If URLs exist → Test URLs directly in browser');
  console.log('   4. Check browser console for image load errors\n');
}

diagnose();
