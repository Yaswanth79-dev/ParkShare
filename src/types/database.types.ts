export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          full_name: string | null
          email: string | null
          phone: string | null
          role: 'driver' | 'host' | 'admin'
          avatar_url: string | null
          created_at: string
        }
        Insert: {
          id: string
          full_name?: string | null
          email?: string | null
          phone?: string | null
          role?: 'driver' | 'host' | 'admin'
          avatar_url?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          full_name?: string | null
          email?: string | null
          phone?: string | null
          role?: 'driver' | 'host' | 'admin'
          avatar_url?: string | null
          created_at?: string
        }
      }
      parking_spaces: {
        Row: {
          id: string
          owner_id: string
          title: string
          description: string | null
          address: string
          city: string
          latitude: number
          longitude: number
          parking_type: 'covered' | 'open' | 'underground'
          vehicle_type: '2-wheeler' | '4-wheeler' | 'both'
          price_per_hour: number
          availability_start: string | null
          availability_end: string | null
          is_verified: boolean
          created_at: string
        }
        Insert: {
          id?: string
          owner_id: string
          title: string
          description?: string | null
          address: string
          city: string
          latitude: number
          longitude: number
          parking_type?: 'covered' | 'open' | 'underground'
          vehicle_type?: '2-wheeler' | '4-wheeler' | 'both'
          price_per_hour: number
          availability_start?: string | null
          availability_end?: string | null
          is_verified?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          owner_id?: string
          title?: string
          description?: string | null
          address?: string
          city?: string
          latitude?: number
          longitude?: number
          parking_type?: 'covered' | 'open' | 'underground'
          vehicle_type?: '2-wheeler' | '4-wheeler' | 'both'
          price_per_hour?: number
          availability_start?: string | null
          availability_end?: string | null
          is_verified?: boolean
          created_at?: string
        }
      }
      parking_images: {
        Row: {
          id: string
          parking_id: string
          image_url: string
          created_at: string
        }
        Insert: {
          id?: string
          parking_id: string
          image_url: string
          created_at?: string
        }
        Update: {
          id?: string
          parking_id?: string
          image_url?: string
          created_at?: string
        }
      }
      bookings: {
        Row: {
          id: string
          user_id: string
          parking_id: string
          booking_start: string
          booking_end: string
          total_price: number
          booking_status: 'pending' | 'confirmed' | 'active' | 'completed' | 'cancelled'
          payment_status: 'pending' | 'paid' | 'refunded'
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          parking_id: string
          booking_start: string
          booking_end: string
          total_price: number
          booking_status?: 'pending' | 'confirmed' | 'active' | 'completed' | 'cancelled'
          payment_status?: 'pending' | 'paid' | 'refunded'
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          parking_id?: string
          booking_start?: string
          booking_end?: string
          total_price?: number
          booking_status?: 'pending' | 'confirmed' | 'active' | 'completed' | 'cancelled'
          payment_status?: 'pending' | 'paid' | 'refunded'
          created_at?: string
        }
      }
      reviews: {
        Row: {
          id: string
          booking_id: string
          user_id: string
          parking_id: string
          rating: number | null
          comment: string | null
          created_at: string
        }
        Insert: {
          id?: string
          booking_id: string
          user_id: string
          parking_id: string
          rating?: number | null
          comment?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          booking_id?: string
          user_id?: string
          parking_id?: string
          rating?: number | null
          comment?: string | null
          created_at?: string
        }
      }
      transactions: {
        Row: {
          id: string
          booking_id: string
          amount: number
          payment_method: string | null
          transaction_status: 'success' | 'failed' | 'pending'
          created_at: string
        }
        Insert: {
          id?: string
          booking_id: string
          amount: number
          payment_method?: string | null
          transaction_status?: 'success' | 'failed' | 'pending'
          created_at?: string
        }
        Update: {
          id?: string
          booking_id?: string
          amount?: number
          payment_method?: string | null
          transaction_status?: 'success' | 'failed' | 'pending'
          created_at?: string
        }
      }
      notifications: {
        Row: {
          id: string
          user_id: string
          title: string
          message: string
          is_read: boolean
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          title: string
          message: string
          is_read?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          title?: string
          message?: string
          is_read?: boolean
          created_at?: string
        }
      }
    }
  }
}
