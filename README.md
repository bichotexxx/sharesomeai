# CloneSome AI - NSFW AI Content Generation Platform

A full-stack Next.js application that replicates the core functionalities of Sharesome AI, providing uncensored AI content generation including images, videos, and interactive chats.

## 🚀 Features

### Core Functionality
- **Uncensored AI Image Generation**: Generate NSFW images using Flux 1 Schnell AI
- **Interactive AI Chat**: Engage in unrestricted conversations with AI characters
- **Character Creation**: Design custom AI characters with unique personalities
- **CivitAI Integration**: Browse and discover popular AI models and character examples
- **Social Features**: Like, share, and discover characters from the community

### Technical Features
- **Completely Free**: No subscriptions or premium tiers
- **Real-time Chat**: WebSocket-based chat system with AI characters
- **Image Generation**: High-resolution image generation with multiple styles
- **User Authentication**: Secure Supabase-based authentication
- **Responsive Design**: Modern dark theme with pink accents
- **Mobile Optimized**: Works seamlessly on all devices

## 🛠️ Tech Stack

- **Frontend**: Next.js 15, React 19, TypeScript
- **Styling**: Tailwind CSS 4
- **Backend**: Next.js API Routes
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth
- **AI Integration**: 
  - Flux 1 Schnell for image generation
  - CivitAI API for model discovery
  - Replicate for AI model hosting
- **State Management**: React Context API
- **Notifications**: React Hot Toast

## 📁 Project Structure

```
sharesome-clone/
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   ├── chat/              # AI chat endpoints
│   │   │   ├── generate-image/    # Image generation
│   │   │   └── civitai/           # CivitAI integration
│   │   ├── auth/                  # Authentication pages
│   │   ├── chat/                  # Chat interface
│   │   ├── characters/            # Character management
│   │   ├── create/                # Character creation
│   │   ├── favorites/             # User favorites
│   │   ├── generate/              # Image generation
│   │   ├── models/                # AI models browser
│   │   └── settings/              # User settings
│   ├── components/
│   │   ├── auth/                  # Authentication components
│   │   ├── CharacterCard.tsx      # Character display
│   │   ├── Header.tsx             # Top navigation
│   │   ├── Sidebar.tsx            # Side navigation
│   │   └── HeroBanner.tsx         # Landing banner
│   ├── contexts/
│   │   └── AuthContext.tsx        # Authentication context
│   ├── hooks/
│   │   └── useAuth.ts             # Authentication hook
│   ├── lib/
│   │   ├── supabase.ts            # Supabase configuration
│   │   └── civitai.ts             # CivitAI service
│   └── middleware.ts              # Route protection
```

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Supabase account
- Replicate API key

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd sharesome-clone
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   Create a `.env.local` file:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   REPLICATE_API_TOKEN=your_replicate_token
   ```

4. **Database Setup**
   Run the following SQL in your Supabase SQL editor:
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

5. **Run the development server**
   ```bash
   npm run dev
   ```

6. **Open your browser**
   Navigate to `http://localhost:3000`

## 🔧 Configuration

### Supabase Setup
1. Create a new Supabase project
2. Get your project URL and anon key
3. Add them to your `.env.local` file
4. Run the database setup SQL above

### Replicate Setup
1. Sign up at [replicate.com](https://replicate.com)
2. Get your API token
3. Add it to your `.env.local` file

### CivitAI Integration
The app automatically integrates with CivitAI's public API to:
- Display popular character examples
- Browse AI models
- Search for specific models or characters

## 🎨 Features Overview

### Home Page
- Hero banner emphasizing free access
- Feature highlights
- Popular character examples from CivitAI
- Search functionality

### Character Creation
- Custom character design
- AI-powered image generation
- Personality customization
- Style selection (realistic, anime, cartoon, fantasy)

### Chat System
- Real-time conversations with AI characters
- Character selection interface
- Message history
- Uncensored responses

### Image Generation
- Flux 1 Schnell AI integration
- Multiple art styles
- High-resolution output
- Download functionality

### Social Features
- Like and favorite characters
- Share characters
- Public/private character settings
- Community discovery

### AI Models Browser
- Browse popular CivitAI models
- Search and filter by type
- View model statistics
- Direct links to CivitAI

## 🔒 Security & Privacy

- **Authentication**: Secure Supabase authentication
- **Data Protection**: Row Level Security (RLS) policies
- **Privacy**: User data is encrypted and protected
- **GDPR Compliant**: User data control and deletion

## 🚀 Deployment

### Vercel (Recommended)
1. Connect your GitHub repository to Vercel
2. Add environment variables
3. Deploy automatically

### Other Platforms
- **Netlify**: Similar to Vercel setup
- **Railway**: Container-based deployment
- **DigitalOcean**: App Platform deployment

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## ⚠️ Disclaimer

This application is designed for adult users and contains NSFW content. Users must be 18+ to use this platform. The application respects user privacy and provides uncensored AI interactions as requested.

## 🆘 Support

For support, please:
1. Check the documentation
2. Search existing issues
3. Create a new issue with detailed information

---

**CloneSome AI** - Unleash your imagination, completely free.
