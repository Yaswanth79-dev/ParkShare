import { createClient } from '@/lib/supabase/client';
import { Database } from '@/types/database.types';

type BookingInsert = Database['public']['Tables']['bookings']['Insert'];

const supabase = createClient();

export const bookingService = {
  async createBooking(bookingData: BookingInsert) {
    const { data, error } = await supabase
      .from('bookings')
      .insert(bookingData)
      .select()
      .single();
      
    if (error) throw error;
    return data;
  },

  async getUserBookings(userId: string) {
    const { data, error } = await supabase
      .from('bookings')
      .select('*, parking_spaces(*)')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
      
    if (error) throw error;
    return data;
  },

  async getHostBookings(hostId: string) {
    const { data, error } = await supabase
      .from('bookings')
      .select('*, parking_spaces!inner(*), profiles(full_name, phone)')
      .eq('parking_spaces.owner_id', hostId)
      .order('created_at', { ascending: false });
      
    if (error) throw error;
    return data;
  },

  async updateBookingStatus(id: string, status: 'confirmed' | 'completed' | 'cancelled') {
    const { data, error } = await supabase
      .from('bookings')
      .update({ booking_status: status })
      .eq('id', id)
      .select()
      .single();
      
    if (error) throw error;
    return data;
  }
};
