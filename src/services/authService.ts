import { createClient } from '@/lib/supabase/client';

const supabase = createClient();

export const authService = {
  async signInWithGoogle() {
    return supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`
      }
    });
  },

  async signUpWithEmail(email: string, password: string, fullName: string) {
    return supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
        }
      }
    });
  },

  async signInWithEmail(email: string, password: string) {
    return supabase.auth.signInWithPassword({
      email,
      password,
    });
  },

  async signInWithPhone(phone: string) {
    return supabase.auth.signInWithOtp({
      phone,
    });
  },

  async verifyPhoneOtp(phone: string, token: string) {
    return supabase.auth.verifyOtp({
      phone,
      token,
      type: 'sms',
    });
  },

  async signOut() {
    return supabase.auth.signOut();
  },

  async updateProfile(userId: string, data: { full_name?: string; avatar_url?: string; role?: 'driver' | 'host' | 'admin' }) {
    return supabase
      .from('profiles')
      .update(data)
      .eq('id', userId);
  }
};
