import { createClient } from '@/lib/supabase/client';
import { Database } from '@/types/database.types';

type ParkingSpace = Database['public']['Tables']['parking_spaces']['Row'];
type ParkingSpaceInsert = Database['public']['Tables']['parking_spaces']['Insert'];

const supabase = createClient();

export const parkingService = {
  async getParkingSpaces(filters?: { city?: string; vehicle_type?: string }) {
    const MOCK_SPACES: any[] = [
      {
        id: "b0000000-0000-0000-0000-000000000000",
        title: "Bahadurpally Secure Parking",
        address: "2-31/5/A, Bahadurpally, Dundigal-Gandimaisamma",
        city: "Hyderabad",
        latitude: 17.5597,
        longitude: 78.4388,
        price_per_hour: 40,
        is_verified: true,
        vehicle_type: "both",
        description: "A secure, verified parking space in Bahadurpally. Available for instant booking.",
        parking_images: [{ image_url: "https://images.unsplash.com/photo-1590674899484-d5640e854abe?q=80&w=1200&auto=format&fit=crop" }],
        owner_id: "mock-owner-1"
      },
      {
        id: "m0000000-0000-0000-0000-000000000001",
        title: "Kukatpally Metro Parking",
        address: "Near KPHB Metro Station",
        city: "Hyderabad",
        latitude: 17.4948,
        longitude: 78.3996,
        price_per_hour: 50,
        is_verified: true,
        vehicle_type: "both",
        description: "Covered parking right next to the metro station.",
        parking_images: [{ image_url: "https://images.unsplash.com/photo-1506521781263-d8422e82f27a?q=80&w=1200&auto=format&fit=crop" }],
        owner_id: "mock-owner-2"
      },
      {
        id: "m0000000-0000-0000-0000-000000000002",
        title: "Gachibowli Tech Park Slots",
        address: "DLF Cyber City Road, Gachibowli",
        city: "Hyderabad",
        latitude: 17.4435,
        longitude: 78.3440,
        price_per_hour: 60,
        is_verified: false,
        vehicle_type: "4-wheeler",
        description: "Spacious parking in the IT corridor.",
        parking_images: [{ image_url: "https://images.unsplash.com/photo-1573348722427-f1d6819fdf98?q=80&w=1200&auto=format&fit=crop" }],
        owner_id: "mock-owner-3"
      }
    ];

    try {
      const timeoutPromise = new Promise((_, reject) => setTimeout(() => reject(new Error('timeout')), 3000));
      
      let query = supabase.from('parking_spaces').select('*, parking_images(image_url)');
      if (filters?.city) query = query.eq('city', filters.city);
      if (filters?.vehicle_type) query = query.eq('vehicle_type', filters.vehicle_type);
      
      const { data, error } = await Promise.race([query, timeoutPromise]) as any;
      
      if (error) throw error;
      
      if (!data || data.length === 0) {
        return MOCK_SPACES;
      }
      return data;
    } catch (err) {
      console.warn("Supabase fetch failed or timed out, returning mock data.", err);
      return MOCK_SPACES;
    }
  },

  async getParkingSpaceById(id: string) {
    const MOCK_SPACES: Record<string, any> = {
      "mock_bahadurpally_1": {
        id: "b0000000-0000-0000-0000-000000000000",
        title: "Bahadurpally Secure Parking",
        address: "2-31/5/A, Bahadurpally, Dundigal-Gandimaisamma",
        city: "Hyderabad",
        latitude: 17.5597,
        longitude: 78.4388,
        price_per_hour: 40,
        is_verified: true,
        vehicle_type: "both",
        description: "A secure, verified parking space in Bahadurpally. Available for instant booking.",
        parking_images: [{ image_url: "https://images.unsplash.com/photo-1590674899484-d5640e854abe?q=80&w=1200&auto=format&fit=crop" }],
        profiles: { full_name: "Mock Host", avatar_url: null }
      },
      "b0000000-0000-0000-0000-000000000000": {
        id: "b0000000-0000-0000-0000-000000000000",
        title: "Bahadurpally Secure Parking",
        address: "2-31/5/A, Bahadurpally, Dundigal-Gandimaisamma",
        city: "Hyderabad",
        latitude: 17.5597,
        longitude: 78.4388,
        price_per_hour: 40,
        is_verified: true,
        vehicle_type: "both",
        description: "A secure, verified parking space in Bahadurpally. Available for instant booking.",
        parking_images: [{ image_url: "https://images.unsplash.com/photo-1590674899484-d5640e854abe?q=80&w=1200&auto=format&fit=crop" }],
        profiles: { full_name: "Mock Host", avatar_url: null }
      },
      "m0000000-0000-0000-0000-000000000001": {
        id: "m0000000-0000-0000-0000-000000000001",
        title: "Kukatpally Metro Parking",
        address: "Near KPHB Metro Station",
        city: "Hyderabad",
        latitude: 17.4948,
        longitude: 78.3996,
        price_per_hour: 50,
        is_verified: true,
        vehicle_type: "both",
        description: "Covered parking right next to the metro station.",
        parking_images: [{ image_url: "https://images.unsplash.com/photo-1506521781263-d8422e82f27a?q=80&w=1200&auto=format&fit=crop" }],
        profiles: { full_name: "Metro Parking Admin", avatar_url: null }
      },
      "m0000000-0000-0000-0000-000000000002": {
        id: "m0000000-0000-0000-0000-000000000002",
        title: "Gachibowli Tech Park Slots",
        address: "DLF Cyber City Road, Gachibowli",
        city: "Hyderabad",
        latitude: 17.4435,
        longitude: 78.3440,
        price_per_hour: 60,
        is_verified: false,
        vehicle_type: "4-wheeler",
        description: "Spacious parking in the IT corridor.",
        parking_images: [{ image_url: "https://images.unsplash.com/photo-1573348722427-f1d6819fdf98?q=80&w=1200&auto=format&fit=crop" }],
        profiles: { full_name: "Tech Park Management", avatar_url: null }
      }
    };

    if (MOCK_SPACES[id]) {
      return MOCK_SPACES[id];
    }
    
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
