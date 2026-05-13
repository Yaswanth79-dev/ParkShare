import { createClient } from '@/lib/supabase/client';
import { Database } from '@/types/database.types';

type ReviewInsert = Database['public']['Tables']['reviews']['Insert'];

const supabase = createClient();

export const reviewService = {
  async createReview(reviewData: ReviewInsert) {
    const { data, error } = await supabase
      .from('reviews')
      .insert(reviewData)
      .select()
      .single();
      
    if (error) throw error;
    return data;
  },

  async getParkingReviews(parkingId: string) {
    const { data, error } = await supabase
      .from('reviews')
      .select('*, profiles(full_name, avatar_url)')
      .eq('parking_id', parkingId)
      .order('created_at', { ascending: false });
      
    if (error) throw error;
    return data;
  }
};
