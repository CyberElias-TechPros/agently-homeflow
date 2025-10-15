// Seed script to run database seeding
import { seedDemoData } from './src/lib/seed.ts';

async function runSeed() {
  try {
    console.log('🌱 Running database seeding...');
    await seedDemoData();
    console.log('✅ Seeding completed successfully!');
  } catch (error) {
    console.error('❌ Seeding failed:', error);
    process.exit(1);
  }
}

runSeed();