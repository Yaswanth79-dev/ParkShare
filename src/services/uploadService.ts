import { createClient } from '@/lib/supabase/client';

const supabase = createClient();

export const uploadService = {
  async uploadImage(file: File, bucket: 'parking-images' | 'user-avatars', path: string) {
    const fileExt = file.name.split('.').pop();
    const fileName = `${path}-${Math.random()}.${fileExt}`;
    const filePath = `${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from(bucket)
      .upload(filePath, file);

    if (uploadError) {
      throw uploadError;
    }

    const { data } = supabase.storage
      .from(bucket)
      .getPublicUrl(filePath);

    return data.publicUrl;
  }
};
