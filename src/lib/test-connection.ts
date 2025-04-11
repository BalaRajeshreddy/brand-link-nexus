import { supabase } from './supabase';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function testSupabaseConnection() {
  try {
    console.log('Testing Supabase connection...');
    const { data, error } = await supabase.from('users').select('count');
    
    if (error) {
      console.error('Supabase connection error:', error);
      return false;
    }
    
    console.log('Supabase connection successful!');
    return true;
  } catch (error) {
    console.error('Supabase connection error:', error);
    return false;
  }
}

async function testDatabaseConnection() {
  try {
    console.log('Testing direct database connection...');
    await prisma.$connect();
    console.log('Database connection successful!');
    return true;
  } catch (error) {
    console.error('Database connection error:', error);
    return false;
  } finally {
    await prisma.$disconnect();
  }
}

async function runTests() {
  console.log('Starting connection tests...\n');
  
  const supabaseResult = await testSupabaseConnection();
  console.log('\n');
  const dbResult = await testDatabaseConnection();
  
  console.log('\nTest Results:');
  console.log('Supabase Connection:', supabaseResult ? '✅ Success' : '❌ Failed');
  console.log('Database Connection:', dbResult ? '✅ Success' : '❌ Failed');
  
  if (supabaseResult && dbResult) {
    console.log('\nAll connections are working properly! 🎉');
  } else {
    console.log('\nSome connections failed. Please check the error messages above. 🔍');
  }
}

// Run the tests
runTests().catch(console.error); 