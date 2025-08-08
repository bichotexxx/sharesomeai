# 🚀 Deployment Guide - CloneSome AI

## 📋 Prerequisites

Before deploying, ensure you have:

1. **Node.js 18+** installed
2. **Git** for version control
3. **Supabase** account and project
4. **Replicate** account and API token
5. **Vercel** account (recommended) or other hosting platform

## 🔧 Step 1: Environment Setup

### 1.1 Create Environment File
Create a `.env.local` file in the root directory:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

# Replicate API for AI Image Generation
REPLICATE_API_TOKEN=your_replicate_api_token
```

### 1.2 Get Supabase Credentials
1. Go to [supabase.com](https://supabase.com)
2. Create a new project
3. Go to Settings → API
4. Copy the URL and anon key

### 1.3 Get Replicate API Token
1. Go to [replicate.com](https://replicate.com)
2. Sign up and create an account
3. Go to Account → API Tokens
4. Create a new token

## 🗄️ Step 2: Database Setup

### 2.1 Run SQL Script
Execute this SQL in your Supabase SQL Editor:

```sql
-- Users table
CREATE TABLE users (
  id UUID REFERENCES auth.users ON DELETE CASCADE,
  email TEXT UNIQUE NOT NULL,
  username TEXT,
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  PRIMARY KEY (id)
);

-- Characters table
CREATE TABLE characters (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  creator_id UUID REFERENCES users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  personality TEXT,
  style TEXT DEFAULT 'realistic',
  image_url TEXT,
  is_public BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Chats table
CREATE TABLE chats (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  character_id UUID REFERENCES characters(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Messages table
CREATE TABLE messages (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  chat_id UUID REFERENCES chats(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  is_character BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Favorites table
CREATE TABLE favorites (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  character_id UUID REFERENCES characters(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, character_id)
);

-- Enable Row Level Security
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE characters ENABLE ROW LEVEL SECURITY;
ALTER TABLE chats ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE favorites ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view their own profile" ON users
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile" ON users
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Characters are viewable by all" ON characters
  FOR SELECT USING (true);

CREATE POLICY "Users can create characters" ON characters
  FOR INSERT WITH CHECK (auth.uid() = creator_id);

CREATE POLICY "Users can update their own characters" ON characters
  FOR UPDATE USING (auth.uid() = creator_id);

CREATE POLICY "Users can delete their own characters" ON characters
  FOR DELETE USING (auth.uid() = creator_id);

CREATE POLICY "Users can view their own chats" ON chats
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create chats" ON chats
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view messages in their chats" ON messages
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM chats 
      WHERE chats.id = messages.chat_id 
      AND chats.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert messages in their chats" ON messages
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM chats 
      WHERE chats.id = messages.chat_id 
      AND chats.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can view their own favorites" ON favorites
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can manage their own favorites" ON favorites
  FOR ALL USING (auth.uid() = user_id);
```

## 🚀 Step 3: Local Development

### 3.1 Install Dependencies
```bash
npm install
```

### 3.2 Run Development Server
```bash
npm run dev
```

### 3.3 Test Locally
Open [http://localhost:3000](http://localhost:3000) in your browser.

## 🌐 Step 4: Deployment Options

### Option A: Vercel (Recommended)

1. **Connect Repository**
   - Go to [vercel.com](https://vercel.com)
   - Import your GitHub repository
   - Select the repository

2. **Configure Environment Variables**
   - Go to Project Settings → Environment Variables
   - Add all variables from `.env.local`

3. **Deploy**
   - Vercel will automatically deploy on push
   - Or click "Deploy" manually

### Option B: Netlify

1. **Connect Repository**
   - Go to [netlify.com](https://netlify.com)
   - Import your GitHub repository

2. **Build Settings**
   - Build command: `npm run build`
   - Publish directory: `.next`

3. **Environment Variables**
   - Go to Site Settings → Environment Variables
   - Add all variables from `.env.local`

### Option C: Railway

1. **Connect Repository**
   - Go to [railway.app](https://railway.app)
   - Import your GitHub repository

2. **Environment Variables**
   - Add all variables from `.env.local`

3. **Deploy**
   - Railway will automatically deploy

## 🔍 Step 5: Post-Deployment Verification

### 5.1 Test Core Features
- [ ] User registration/login
- [ ] Character creation
- [ ] Image generation
- [ ] Chat functionality
- [ ] CivitAI integration
- [ ] Favorites system

### 5.2 Check API Endpoints
- [ ] `/api/civitai/characters` - Character examples
- [ ] `/api/civitai/models` - AI models
- [ ] `/api/generate-image` - Image generation
- [ ] `/api/chat` - Chat responses

### 5.3 Monitor Performance
- [ ] Page load times
- [ ] API response times
- [ ] Error rates
- [ ] User engagement

## 🛠️ Step 6: Customization

### 6.1 Update Branding
- Replace logo in `/public/logo.svg`
- Update colors in `tailwind.config.js`
- Modify text in components

### 6.2 Add Custom Features
- Implement real AI chat (replace simulated responses)
- Add more image generation models
- Integrate additional APIs

### 6.3 Security Enhancements
- Add rate limiting
- Implement content moderation
- Add user verification

## 📊 Step 7: Analytics & Monitoring

### 7.1 Add Analytics
```bash
npm install @vercel/analytics
```

### 7.2 Error Monitoring
```bash
npm install @sentry/nextjs
```

## 🔧 Troubleshooting

### Common Issues

1. **Build Errors**
   - Check Node.js version (18+)
   - Clear `.next` folder
   - Run `npm install` again

2. **API Errors**
   - Verify environment variables
   - Check Supabase connection
   - Validate Replicate API token

3. **Image Loading Issues**
   - Check `next.config.js` domains
   - Verify CORS settings
   - Test image URLs directly

4. **Authentication Issues**
   - Verify Supabase configuration
   - Check RLS policies
   - Test auth flow locally

## 📞 Support

If you encounter issues:

1. Check the [README.md](README.md) for detailed documentation
2. Review the [Supabase documentation](https://supabase.com/docs)
3. Check [Next.js documentation](https://nextjs.org/docs)
4. Create an issue in the repository

---

**🎉 Congratulations!** Your CloneSome AI platform is now deployed and ready for users.

**Remember**: This is an NSFW platform, so ensure you comply with your hosting provider's terms of service and implement appropriate age verification if required.
