#!/bin/bash
# FootRate AI Deployment Script

echo "🚀 Deploying FootRate AI to Vercel..."
echo ""

# Check if Vercel CLI is installed
if ! command -v vercel &> /dev/null; then
    echo "❌ Vercel CLI not found. Installing..."
    npm install -g vercel
fi

echo "✅ Building application..."
npm run build

if [ $? -eq 0 ]; then
    echo "✅ Build successful! Deploying to production..."
    echo ""
    
    # Deploy to production
    vercel --prod
    
    echo ""
    echo "🎉 Deployment complete!"
    echo "📱 Your app should be live at: https://footrateai.vercel.app"
    echo ""
    echo "📋 Next Steps:"
    echo "1. Add environment variables in Vercel dashboard"
    echo "2. Update Supabase redirect URLs"
    echo "3. Test all functionality"
    echo ""
    echo "📖 See VERCEL_DEPLOYMENT_GUIDE.md for detailed instructions"
else
    echo "❌ Build failed. Please check the errors above."
    exit 1
fi


