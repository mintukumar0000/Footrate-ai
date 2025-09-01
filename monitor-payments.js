// Real-Time Payment Monitoring Script
// Run this to monitor your Dodo Payment integration

const { createClient } = require('@supabase/supabase-js');

// Initialize Supabase client
const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function monitorPayments() {
  console.log('🔍 Starting real-time payment monitoring...\n');

  // Monitor Pro subscriptions
  const { data: proUsers, error } = await supabase
    .from('user_subscriptions')
    .select('*')
    .eq('subscription_tier', 'pro')
    .order('updated_at', { ascending: false });

  if (error) {
    console.error('❌ Error fetching Pro users:', error);
    return;
  }

  console.log(`📊 Current Pro Users: ${proUsers.length}`);
  
  if (proUsers.length > 0) {
    console.log('\n👥 Latest Pro Subscriptions:');
    proUsers.slice(0, 5).forEach(user => {
      console.log(`  - User: ${user.user_id}`);
      console.log(`    Tier: ${user.subscription_tier}`);
      console.log(`    Limit: ${user.monthly_limit} analyses`);
      console.log(`    Used: ${user.analyses_used_this_month} analyses`);
      console.log(`    Updated: ${new Date(user.updated_at).toLocaleString()}`);
      console.log('');
    });
  }

  // Monitor today's new subscriptions
  const today = new Date().toISOString().split('T')[0];
  const { data: todaySubscriptions } = await supabase
    .from('user_subscriptions')
    .select('*')
    .eq('subscription_tier', 'pro')
    .gte('created_at', today);

  console.log(`📅 Today's New Pro Subscriptions: ${todaySubscriptions?.length || 0}`);

  // Monitor usage statistics
  const { data: usageStats } = await supabase
    .from('user_subscriptions')
    .select('subscription_tier, monthly_limit, analyses_used_this_month');

  if (usageStats) {
    const proStats = usageStats.filter(u => u.subscription_tier === 'pro');
    const totalUsage = proStats.reduce((sum, user) => sum + user.analyses_used_this_month, 0);
    const avgUsage = proStats.length > 0 ? totalUsage / proStats.length : 0;

    console.log(`📈 Usage Statistics:`);
    console.log(`  - Total Pro users: ${proStats.length}`);
    console.log(`  - Total analyses used: ${totalUsage}`);
    console.log(`  - Average usage per user: ${avgUsage.toFixed(1)}`);
  }

  console.log('\n✅ Monitoring complete!');
  console.log('\n📋 Next steps:');
  console.log('1. Check Dodo Payment dashboard: https://app.dodopayments.com/home');
  console.log('2. Monitor Vercel logs: vercel logs --follow');
  console.log('3. Check Supabase dashboard for real-time updates');
}

// Run monitoring
monitorPayments().catch(console.error);

// Real-time subscription monitoring
console.log('\n🔄 Setting up real-time subscription monitoring...');

const subscription = supabase
  .channel('subscription_changes')
  .on('postgres_changes', 
    { event: '*', schema: 'public', table: 'user_subscriptions' },
    (payload) => {
      console.log('🆕 Real-time subscription change:', payload);
      
      if (payload.eventType === 'INSERT' && payload.new.subscription_tier === 'pro') {
        console.log('🎉 New Pro subscription detected!');
        console.log(`   User: ${payload.new.user_id}`);
        console.log(`   Time: ${new Date().toLocaleString()}`);
      }
    }
  )
  .subscribe();

console.log('✅ Real-time monitoring active! Press Ctrl+C to stop.');
