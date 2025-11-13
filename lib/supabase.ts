import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Database types
export interface UserProfile {
  user_id: string;
  email: string;
  marketing_consent: boolean;
  created_at: string;
}

export interface Favorite {
  user_id: string;
  team_id: string;
  added_at: string;
}

export interface UserSettings {
  user_id: string;
  spoiler_default: boolean;
  donation_ack: boolean;
  updated_at: string;
}

// Helper functions
export const getUserProfile = async (userId: string): Promise<UserProfile | null> => {
  const { data, error } = await supabase
    .from('user_profiles')
    .select('*')
    .eq('user_id', userId)
    .single();
  
  if (error) return null;
  return data;
};

export const upsertUserProfile = async (profile: Partial<UserProfile>): Promise<UserProfile | null> => {
  const { data, error } = await supabase
    .from('user_profiles')
    .upsert(profile)
    .select()
    .single();
  
  if (error) return null;
  return data;
};

export const getUserFavorites = async (userId: string): Promise<Favorite[]> => {
  const { data, error } = await supabase
    .from('favorites')
    .select('*')
    .eq('user_id', userId)
    .order('added_at', { ascending: false });
  
  if (error) return [];
  return data || [];
};

export const addFavorite = async (userId: string, teamId: string): Promise<boolean> => {
  const { error } = await supabase
    .from('favorites')
    .insert({ user_id: userId, team_id: teamId });
  
  return !error;
};

export const removeFavorite = async (userId: string, teamId: string): Promise<boolean> => {
  const { error } = await supabase
    .from('favorites')
    .delete()
    .eq('user_id', userId)
    .eq('team_id', teamId);
  
  return !error;
};

export const getUserSettings = async (userId: string): Promise<UserSettings | null> => {
  const { data, error } = await supabase
    .from('user_settings')
    .select('*')
    .eq('user_id', userId)
    .single();
  
  if (error) return null;
  return data;
};

export const upsertUserSettings = async (settings: Partial<UserSettings>): Promise<UserSettings | null> => {
  const { data, error } = await supabase
    .from('user_settings')
    .upsert(settings)
    .select()
    .single();
  
  if (error) return null;
  return data;
};
