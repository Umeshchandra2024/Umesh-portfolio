// Test MongoDB Connection
// Run this with: node test-mongodb.js

import mongoose from 'mongoose';

const MONGO_URI = 'mongodb+srv://umesh:umeshData11@cluster0.oqwkqyz.mongodb.net/portfolio?retryWrites=true&w=majority';

console.log('🔍 Testing MongoDB connection...');
console.log('URI:', MONGO_URI.replace(/:[^:@]+@/, ':****@')); // Hide password

mongoose.connect(MONGO_URI, {
  serverSelectionTimeoutMS: 30000,
  socketTimeoutMS: 45000,
  family: 4,
})
.then(() => {
  console.log('✅ SUCCESS! MongoDB connected');
  process.exit(0);
})
.catch((error) => {
  console.error('❌ FAILED! MongoDB connection error');
  console.error('Error name:', error.name);
  console.error('Error message:', error.message);
  console.error('Error code:', error.code);
  console.error('\n📋 Full error details:');
  console.error(error);
  process.exit(1);
});

// Timeout after 35 seconds
setTimeout(() => {
  console.error('⏱️ Connection timeout after 35 seconds');
  process.exit(1);
}, 35000);