import { createClient } from '@/lib/supabase/client';
import { Database } from '@/types/database.types';

type ParkingSpace = Database['public']['Tables']['parking_spaces']['Row'];
type ParkingSpaceInsert = Database['public']['Tables']['parking_spaces']['Insert'];

const supabase = createClient();

export const parkingService = {
  async getParkingSpaces(filters?: { city?: string; vehicle_type?: string }) {
    let query = supabase.from('parking_spaces').select('*, parking_images(image_url)');
    if (filters?.city) query = query.eq('city', filters.city);
    if (filters?.vehicle_type) query = query.eq('vehicle_type', filters.vehicle_type);
    
    const { data, error } = await query;
    if (error) throw error;
    return data;
  },

  async getParkingSpaceById(id: string) {
    const { data, error } = await supabase
      .from('parking_spaces')
      .select('*, profiles(full_name, avatar_url), parking_images(image_url)')
      .eq('id', id)
      .single();
      
    if (error) throw error;
    return data;
  },

  async createParkingSpace(parkingData: ParkingSpaceInsert) {
    const { data, error } = await supabase
      .from('parking_spaces')
      .insert(parkingData)
      .select()
      .single();
      
    if (error) throw error;
    return data;
  },

  async uploadParkingImage(file: File, spaceId: string, ownerId: string) {
    const fileExt = file.name.split('.').pop();
    const fileName = `${spaceId}/${Math.random()}.${fileExt}`;

    const { error: uploadError } = await supabase.storage
      .from('parking-images')
      .upload(fileName, file);

    if (uploadError) throw uploadError;

    const { data: { publicUrl } } = supabase.storage
      .from('parking-images')
      .getPublicUrl(fileName);

    const { error: dbError } = await supabase
      .from('parking_images')
      .insert({
        parking_id: spaceId,
        image_url: publicUrl
      });

    if (dbError) throw dbError;
    return publicUrl;
  },

  async updateParkingSpace(id: string, updates: Partial<ParkingSpaceInsert>) {
    const { data, error } = await supabase
      .from('parking_spaces')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
      
    if (error) throw error;
    return data;
  },

  async subscribeToAvailability(id: string, callback: (payload: any) => void) {
    const channel = supabase
      .channel('schema-db-changes')
      .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'parking_spaces', filter: `id=eq.${id}` }, callback)
      .subscribe();
      
    return () => supabase.removeChannel(channel);
  }
};
