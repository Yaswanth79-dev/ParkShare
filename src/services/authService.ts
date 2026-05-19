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
    const response = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
        }
      }
    });

    if (response.data?.session && response.data?.user) {
      // Auto-create profile if successful and logged in immediately
      await supabase.from('profiles').upsert([
        {
          id: response.data.user.id,
          full_name: fullName,
          email: email,
        }
      ], { onConflict: 'id' });
    }
    
    return response;
  },

  async signInWithEmail(email: string, password: string) {
    return supabase.auth.signInWithPassword({
      email,
      password,
    });
  },

  async signInWithPhone(phone: string) {
    // MOCK: Automatically resolve instead of using real SMS provider
    return { data: { message: "Mock OTP sent" }, error: null };
  },

  async verifyPhoneOtp(phone: string, token: string) {
    // MOCK: Accept any 6 digit token
    if (!token || token.length < 4) {
      return { data: null, error: new Error("Invalid OTP. Please enter a valid code.") };
    }
    
    // Create a dummy email for this phone number to use standard email auth behind the scenes
    const cleanPhone = phone.replace(/[^0-9+]/g, '');
    const dummyEmail = `${cleanPhone}@parkshare-phone.local`;
    const dummyPassword = `PhoneMock123!@#${cleanPhone}`;
    
    // Try to sign in first
    const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
      email: dummyEmail,
      password: dummyPassword,
    });
    
    if (!signInError && signInData.session) {
      return { data: signInData, error: null };
    }
    
    // If sign in fails, they are a new user, try to sign up
    const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
      email: dummyEmail,
      password: dummyPassword,
      options: {
        data: {
          full_name: `Phone User ${cleanPhone.slice(-4)}`,
        }
      }
    });
    
    if (signUpData?.user) {
      // Auto-create profile
      await supabase.from('profiles').upsert([
        {
          id: signUpData.user.id,
          full_name: `Phone User ${cleanPhone.slice(-4)}`,
        }
      ], { onConflict: 'id' });
    }
    
    return { data: signUpData, error: signUpError };
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
