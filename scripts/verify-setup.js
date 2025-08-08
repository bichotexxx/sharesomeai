#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

console.log('🔍 CloneSome AI - Setup Verification\n');

// Check if .env.local exists
const envPath = path.join(process.cwd(), '.env.local');
const envExists = fs.existsSync(envPath);

console.log('📋 Environment Configuration:');
console.log(`   .env.local exists: ${envExists ? '✅' : '❌'}`);

if (envExists) {
  const envContent = fs.readFileSync(envPath, 'utf8');
  const requiredVars = [
    'NEXT_PUBLIC_SUPABASE_URL',
    'NEXT_PUBLIC_SUPABASE_ANON_KEY',
    'REPLICATE_API_TOKEN'
  ];

  requiredVars.forEach(varName => {
    const hasVar = envContent.includes(varName);
    console.log(`   ${varName}: ${hasVar ? '✅' : '❌'}`);
  });
}

// Check package.json
const packagePath = path.join(process.cwd(), 'package.json');
const packageExists = fs.existsSync(packagePath);

console.log('\n📦 Package Configuration:');
console.log(`   package.json exists: ${packageExists ? '✅' : '❌'}`);

if (packageExists) {
  const packageJson = JSON.parse(fs.readFileSync(packagePath, 'utf8'));
  const requiredDeps = [
    'next',
    'react',
    '@supabase/supabase-js',
    'replicate',
    'react-hot-toast'
  ];

  requiredDeps.forEach(dep => {
    const hasDep = packageJson.dependencies && packageJson.dependencies[dep];
    console.log(`   ${dep}: ${hasDep ? '✅' : '❌'}`);
  });
}

// Check key files
const requiredFiles = [
  'src/app/layout.tsx',
  'src/lib/supabase.ts',
  'src/lib/civitai.ts',
  'src/contexts/AuthContext.tsx',
  'src/app/api/generate-image/route.ts',
  'src/app/api/civitai/characters/route.ts',
  'src/app/api/civitai/models/route.ts',
  'next.config.js',
  'tailwind.config.js'
];

console.log('\n📁 Required Files:');
requiredFiles.forEach(file => {
  const filePath = path.join(process.cwd(), file);
  const exists = fs.existsSync(filePath);
  console.log(`   ${file}: ${exists ? '✅' : '❌'}`);
});

// Check directories
const requiredDirs = [
  'src/app',
  'src/components',
  'src/lib',
  'src/contexts',
  'src/hooks',
  'public'
];

console.log('\n📂 Required Directories:');
requiredDirs.forEach(dir => {
  const dirPath = path.join(process.cwd(), dir);
  const exists = fs.existsSync(dirPath);
  console.log(`   ${dir}: ${exists ? '✅' : '❌'}`);
});

console.log('\n🎯 Next Steps:');
console.log('1. Run: npm install');
console.log('2. Create .env.local with your credentials');
console.log('3. Set up Supabase database with the provided SQL');
console.log('4. Run: npm run dev');
console.log('5. Test the application locally');
console.log('6. Deploy to your preferred platform');

console.log('\n📚 Documentation:');
console.log('- README.md: Complete project documentation');
console.log('- DEPLOYMENT.md: Step-by-step deployment guide');
console.log('- Supabase: https://supabase.com/docs');
console.log('- Replicate: https://replicate.com/docs');

console.log('\n🚀 Ready to deploy!');
