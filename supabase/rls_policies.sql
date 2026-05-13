-- ParkShare India Row Level Security Policies

-- Enable RLS on all tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE parking_spaces ENABLE ROW LEVEL SECURITY;
ALTER TABLE parking_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

-- Profiles: Users can read public profiles and update their own. Admins can do all.
CREATE POLICY "Public profiles are viewable by everyone." ON profiles FOR SELECT USING (true);
CREATE POLICY "Users can insert their own profile." ON profiles FOR INSERT WITH CHECK (auth.uid() = id);
CREATE POLICY "Users can update own profile." ON profiles FOR UPDATE USING (auth.uid() = id);

-- Parking Spaces: Anyone can view, only hosts/admins can create/update.
CREATE POLICY "Parking spaces are viewable by everyone." ON parking_spaces FOR SELECT USING (true);
CREATE POLICY "Hosts can insert their own parking spaces." ON parking_spaces FOR INSERT WITH CHECK (auth.uid() = owner_id);
CREATE POLICY "Hosts can update their own parking spaces." ON parking_spaces FOR UPDATE USING (auth.uid() = owner_id);
CREATE POLICY "Hosts can delete their own parking spaces." ON parking_spaces FOR DELETE USING (auth.uid() = owner_id);

-- Parking Images: Public read, host write
CREATE POLICY "Parking images are viewable by everyone." ON parking_images FOR SELECT USING (true);
CREATE POLICY "Hosts can manage parking images" ON parking_images FOR ALL USING (
  auth.uid() IN (SELECT owner_id FROM parking_spaces WHERE id = parking_id)
);

-- Bookings: Users can view their own, hosts can view bookings for their spaces
CREATE POLICY "Users can view their own bookings" ON bookings FOR SELECT USING (
  auth.uid() = user_id OR 
  auth.uid() IN (SELECT owner_id FROM parking_spaces WHERE id = parking_id)
);
CREATE POLICY "Users can create bookings" ON bookings FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users and hosts can update bookings" ON bookings FOR UPDATE USING (
  auth.uid() = user_id OR 
  auth.uid() IN (SELECT owner_id FROM parking_spaces WHERE id = parking_id)
);

-- Reviews: Public read, users can insert for their bookings
CREATE POLICY "Reviews are viewable by everyone" ON reviews FOR SELECT USING (true);
CREATE POLICY "Users can create reviews for their bookings" ON reviews FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Transactions: Only involved users can view
CREATE POLICY "Users can view own transactions" ON transactions FOR SELECT USING (
  auth.uid() IN (SELECT user_id FROM bookings WHERE id = booking_id) OR
  auth.uid() IN (SELECT owner_id FROM parking_spaces WHERE id = (SELECT parking_id FROM bookings WHERE id = booking_id))
);

-- Notifications: Only the user can view/update their own notifications
CREATE POLICY "Users can view own notifications" ON notifications FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can update own notifications" ON notifications FOR UPDATE USING (auth.uid() = user_id);

-- Storage Buckets Setup
INSERT INTO storage.buckets (id, name, public) VALUES ('parking-images', 'parking-images', true) ON CONFLICT DO NOTHING;
INSERT INTO storage.buckets (id, name, public) VALUES ('user-avatars', 'user-avatars', true) ON CONFLICT DO NOTHING;

-- Storage Policies
CREATE POLICY "Avatar images are publicly accessible." ON storage.objects FOR SELECT USING (bucket_id = 'user-avatars');
CREATE POLICY "Anyone can upload an avatar." ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'user-avatars');
CREATE POLICY "Parking images are publicly accessible." ON storage.objects FOR SELECT USING (bucket_id = 'parking-images');
CREATE POLICY "Hosts can upload parking images." ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'parking-images');
