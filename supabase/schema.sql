-- ParkShare India Database Schema

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Profiles (Extends auth.users)
CREATE TABLE profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  full_name TEXT,
  email TEXT UNIQUE,
  phone TEXT UNIQUE,
  role TEXT CHECK (role IN ('driver', 'host', 'admin')) DEFAULT 'driver',
  avatar_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Parking Spaces
CREATE TABLE parking_spaces (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  owner_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  address TEXT NOT NULL,
  city TEXT NOT NULL,
  latitude DOUBLE PRECISION NOT NULL,
  longitude DOUBLE PRECISION NOT NULL,
  parking_type TEXT CHECK (parking_type IN ('covered', 'open', 'underground')) DEFAULT 'open',
  vehicle_type TEXT CHECK (vehicle_type IN ('2-wheeler', '4-wheeler', 'both')) DEFAULT '4-wheeler',
  price_per_hour DECIMAL(10, 2) NOT NULL,
  availability_start TIME,
  availability_end TIME,
  is_verified BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Parking Images
CREATE TABLE parking_images (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  parking_id UUID REFERENCES parking_spaces(id) ON DELETE CASCADE,
  image_url TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Bookings
CREATE TABLE bookings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  parking_id UUID REFERENCES parking_spaces(id) ON DELETE CASCADE,
  booking_start TIMESTAMPTZ NOT NULL,
  booking_end TIMESTAMPTZ NOT NULL,
  total_price DECIMAL(10, 2) NOT NULL,
  booking_status TEXT CHECK (booking_status IN ('pending', 'confirmed', 'active', 'completed', 'cancelled')) DEFAULT 'pending',
  payment_status TEXT CHECK (payment_status IN ('pending', 'paid', 'refunded')) DEFAULT 'pending',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. Reviews
CREATE TABLE reviews (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  booking_id UUID REFERENCES bookings(id) ON DELETE CASCADE,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  parking_id UUID REFERENCES parking_spaces(id) ON DELETE CASCADE,
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  comment TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. Transactions
CREATE TABLE transactions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  booking_id UUID REFERENCES bookings(id) ON DELETE CASCADE,
  amount DECIMAL(10, 2) NOT NULL,
  payment_method TEXT,
  transaction_status TEXT CHECK (transaction_status IN ('success', 'failed', 'pending')) DEFAULT 'pending',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. Notifications
CREATE TABLE notifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  is_read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Realtime
ALTER PUBLICATION supabase_realtime ADD TABLE parking_spaces;
ALTER PUBLICATION supabase_realtime ADD TABLE bookings;
ALTER PUBLICATION supabase_realtime ADD TABLE notifications;
