import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://yvagsrpwvemvfneigzja.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inl2YWdzcnB3dmVtdmZuZWlnemphIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQ2MDkxNjYsImV4cCI6MjA3MDE4NTE2Nn0.Vc7k7ByBOK_8Pu3cXJovlPiHNNie5zMm2X5dRaEJL5c';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type Database = {
  public: {
    Tables: {
      users: {
        Row: {
          id: string;
          created_at: string;
          email: string;
          username: string;
          avatar_url: string | null;
        };
        Insert: {
          id?: string;
          created_at?: string;
          email: string;
          username: string;
          avatar_url?: string | null;
        };
        Update: {
          id?: string;
          created_at?: string;
          email?: string;
          username?: string;
          avatar_url?: string | null;
        };
      };
      characters: {
        Row: {
          id: string;
          created_at: string;
          name: string;
          description: string;
          image_url: string;
          creator_id: string;
          personality: string;
          style: string;
          is_public: boolean;
        };
        Insert: {
          id?: string;
          created_at?: string;
          name: string;
          description: string;
          image_url: string;
          creator_id: string;
          personality: string;
          style: string;
          is_public?: boolean;
        };
        Update: {
          id?: string;
          created_at?: string;
          name?: string;
          description?: string;
          image_url?: string;
          creator_id?: string;
          personality?: string;
          style?: string;
          is_public?: boolean;
        };
      };
      chats: {
        Row: {
          id: string;
          created_at: string;
          user_id: string;
          character_id: string;
          last_message: string | null;
          last_message_at: string | null;
        };
        Insert: {
          id?: string;
          created_at?: string;
          user_id: string;
          character_id: string;
          last_message?: string | null;
          last_message_at?: string | null;
        };
        Update: {
          id?: string;
          created_at?: string;
          user_id?: string;
          character_id?: string;
          last_message?: string | null;
          last_message_at?: string | null;
        };
      };
      messages: {
        Row: {
          id: string;
          created_at: string;
          chat_id: string;
          content: string;
          is_character: boolean;
        };
        Insert: {
          id?: string;
          created_at?: string;
          chat_id: string;
          content: string;
          is_character: boolean;
        };
        Update: {
          id?: string;
          created_at?: string;
          chat_id?: string;
          content?: string;
          is_character?: boolean;
        };
      };
      favorites: {
        Row: {
          id: string;
          created_at: string;
          user_id: string;
          character_id: string;
        };
        Insert: {
          id?: string;
          created_at?: string;
          user_id: string;
          character_id: string;
        };
        Update: {
          id?: string;
          created_at?: string;
          user_id?: string;
          character_id?: string;
        };
      };
    };
  };
};