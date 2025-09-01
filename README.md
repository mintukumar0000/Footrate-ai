# 🦶 FootRate AI - AI-Powered Foot Analysis

[![Open Source](https://img.shields.io/badge/Open%20Source-Yes-green.svg)](https://github.com/mintukumar0000/footrate-ai)
[![License](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Tech Stack](https://img.shields.io/badge/Tech%20Stack-React%20%7C%20TypeScript%20%7C%20Supabase%20%7C%20OpenAI-brightgreen.svg)](https://github.com/mintukumar0000/footrate-ai)

> **Real AI-powered foot analysis with medical-grade precision** 🧠

## 🌟 Features

### ✨ Core Features
- **AI-Powered Analysis**: Advanced foot analysis using OpenAI GPT-4 Vision
- **Medical Grade**: Professional-grade foot assessment and recommendations
- **Real-time Processing**: Instant analysis with detailed insights
- **Privacy First**: Secure, private, and GDPR-compliant

### 📊 Subscription System
- **Free Plan**: 3 AI analyses per month
- **Pro Plan**: 50 AI analyses per month ($9/month)
- **Real-time Usage Tracking**: Monitor your analysis usage
- **Seamless Upgrades**: Easy subscription management

### 🎯 Analysis Features
- **Overall Score**: Comprehensive foot health assessment
- **Detailed Metrics**: Skin, nail, shape, symmetry, and cleanliness scores
- **Issue Detection**: Identify potential foot problems
- **Improvement Tips**: Personalized recommendations
- **Progress Tracking**: Monitor improvements over time

## 🚀 Live Demo

**Visit**: [https://footrateai.vercel.app](https://footrateai.vercel.app)

## 🛠️ Tech Stack

### Frontend
- **React 18** - Modern UI framework
- **TypeScript** - Type-safe development
- **Vite** - Fast build tool
- **Tailwind CSS** - Utility-first CSS framework
- **Lucide React** - Beautiful icons

### Backend & Database
- **Supabase** - Backend-as-a-Service
- **PostgreSQL** - Reliable database
- **Row Level Security (RLS)** - Data protection
- **Real-time subscriptions** - Live updates

### AI & APIs
- **OpenAI GPT-4 Vision** - Advanced image analysis
- **Dodo Payment** - Payment processing
- **Vercel** - Deployment platform

### Development Tools
- **ESLint** - Code quality
- **Prettier** - Code formatting
- **Husky** - Git hooks

## 📦 Installation

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Supabase account
- OpenAI API key
- Dodo Payment account (for payments)

### Setup Steps

1. **Clone the repository**
   ```bash
   git clone https://github.com/mintukumar0000/footrate-ai.git
   cd footrate-ai
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   ```
   
   Fill in your environment variables:
   ```env
   # Supabase
   VITE_SUPABASE_URL=your_supabase_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
   
   # OpenAI
   VITE_OPENAI_API_KEY=your_openai_api_key
   
   # Dodo Payment
   DODO_SECRET_KEY=your_dodo_secret_key
   DODO_PUBLIC_KEY=your_dodo_public_key
   DODO_PRODUCT_ID=your_dodo_product_id
   DODO_WEBHOOK_SECRET=your_webhook_secret
   
   # Site URL
   SITE_URL=https://your-domain.vercel.app
   ```

4. **Set up Supabase database**
   - Run the SQL from `database-schema.sql` in your Supabase SQL Editor
   - Configure authentication settings
   - Set up email templates

5. **Start development server**
   ```bash
   npm run dev
   ```

6. **Deploy to Vercel**
   ```bash
   npm run build
   vercel --prod
   ```

## 🗄️ Database Schema

The application uses the following main tables:

### `user_subscriptions`
- Manages user subscription tiers (free/pro)
- Tracks usage limits and current usage
- Stores payment information

### `foot_analyses`
- Stores detailed analysis results
- Includes scores for different aspects
- Tracks improvement recommendations

### `subscription_history`
- Audit trail for subscription changes
- Payment history and cancellations

## 🔧 Configuration

### Supabase Setup
1. Create a new Supabase project
2. Run the database schema
3. Configure authentication
4. Set up email templates
5. Configure RLS policies

### OpenAI Setup
1. Get API key from OpenAI
2. Configure GPT-4 Vision access
3. Set usage limits

### Dodo Payment Setup
1. Create Dodo Payment account
2. Configure webhooks
3. Set up product pricing
4. Test payment flow

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details.

### How to Contribute
1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines
- Follow TypeScript best practices
- Write meaningful commit messages
- Add tests for new features
- Update documentation

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **OpenAI** for providing the GPT-4 Vision API
- **Supabase** for the excellent backend platform
- **Vercel** for seamless deployment
- **Dodo Payment** for payment processing
- **Tailwind CSS** for the beautiful styling framework

## 📞 Contact

- **Email**: [heyquixy@gmail.com](mailto:heyquixy@gmail.com)
- **Twitter**: [@Mintu_aa](https://x.com/Mintu_aa)
- **LinkedIn**: [Mintu Kumar](https://www.linkedin.com/in/mintu-nee-3bb156317/)
- **GitHub**: [@mintukumar0000](https://github.com/mintukumar0000)

## ⭐ Star History

[![Star History Chart](https://api.star-history.com/svg?repos=mintukumar0000/footrate-ai&type=Date)](https://star-history.com/#mintukumar0000/footrate-ai&Date)

---

**Made with ❤️ by [Mintu Kumar](https://github.com/mintukumar0000)**

*Shaping the future with AI—where imagination meets innovation.* 🚀
