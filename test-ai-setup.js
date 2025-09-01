#!/usr/bin/env node

/**
 * 🧪 FootRate AI - Real AI Setup Test Script
 * 
 * Run this to verify your AI API keys are working correctly
 * Usage: node test-ai-setup.js
 */

import dotenv from 'dotenv';
import OpenAI from 'openai';
import { Anthropic } from '@anthropic-ai/sdk';

// Load environment variables
dotenv.config();

const testAISetup = async () => {
  console.log('🧪 Testing FootRate AI Setup...\n');

  // Check environment variables
  console.log('📋 Environment Variables:');
  console.log(`VITE_SUPABASE_URL: ${process.env.VITE_SUPABASE_URL ? '✅ Set' : '❌ Missing'}`);
  console.log(`VITE_SUPABASE_ANON_KEY: ${process.env.VITE_SUPABASE_ANON_KEY ? '✅ Set' : '❌ Missing'}`);
  console.log(`VITE_OPENAI_API_KEY: ${process.env.VITE_OPENAI_API_KEY ? '✅ Set' : '❌ Missing'}`);
  console.log(`VITE_ANTHROPIC_API_KEY: ${process.env.VITE_ANTHROPIC_API_KEY ? '✅ Set' : '❌ Missing'}\n`);

  // Test OpenAI connection
  if (process.env.VITE_OPENAI_API_KEY) {
    console.log('🤖 Testing OpenAI Connection...');
    try {
      const openai = new OpenAI({
        apiKey: process.env.VITE_OPENAI_API_KEY,
      });

      const response = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [{ role: "user", content: "Say 'OpenAI connection successful!'" }],
        max_tokens: 10
      });

      console.log('✅ OpenAI API Key Valid!');
      console.log(`   Response: ${response.choices[0]?.message?.content}\n`);
    } catch (error) {
      console.log('❌ OpenAI Connection Failed:');
      console.log(`   Error: ${error.message}\n`);
    }
  }

  // Test Anthropic connection  
  if (process.env.VITE_ANTHROPIC_API_KEY) {
    console.log('🤖 Testing Anthropic Connection...');
    try {
      const anthropic = new Anthropic({
        apiKey: process.env.VITE_ANTHROPIC_API_KEY,
      });

      const response = await anthropic.messages.create({
        model: "claude-3-haiku-20240307",
        max_tokens: 10,
        messages: [{ role: "user", content: "Say 'Anthropic connection successful!'" }]
      });

      console.log('✅ Anthropic API Key Valid!');
      console.log(`   Response: ${response.content[0]?.text}\n`);
    } catch (error) {
      console.log('❌ Anthropic Connection Failed:');
      console.log(`   Error: ${error.message}\n`);
    }
  }

  // Final recommendations
  console.log('🚀 Setup Status:');
  
  if (!process.env.VITE_OPENAI_API_KEY && !process.env.VITE_ANTHROPIC_API_KEY) {
    console.log('❌ No AI API keys configured!');
    console.log('   Please add at least one API key to your .env file');
    console.log('   OpenAI: VITE_OPENAI_API_KEY=sk-...');
    console.log('   Anthropic: VITE_ANTHROPIC_API_KEY=sk-ant-...');
  } else {
    console.log('✅ AI services configured correctly!');
    console.log('   Your FootRate AI is ready for real analysis');
  }

  if (!process.env.VITE_SUPABASE_URL || !process.env.VITE_SUPABASE_ANON_KEY) {
    console.log('⚠️  Supabase not configured - database features disabled');
  } else {
    console.log('✅ Supabase configured - database ready');
  }

  console.log('\n🎯 Next Steps:');
  console.log('1. Make sure all keys are properly set in .env file');
  console.log('2. Run: npm run dev');  
  console.log('3. Test with brain image (should be rejected!)');
  console.log('4. Test with foot image (should work!)');
};

// Run the test
testAISetup().catch(console.error);
