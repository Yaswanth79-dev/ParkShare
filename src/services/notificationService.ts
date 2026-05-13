import { createClient } from '@/lib/supabase/client';

const supabase = createClient();

export const notificationService = {
  async getUserNotifications(userId: string) {
    const { data, error } = await supabase
      .from('notifications')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
      
    if (error) throw error;
    return data;
  },

  async markAsRead(notificationId: string) {
    const { data, error } = await supabase
      .from('notifications')
      .update({ is_read: true })
      .eq('id', notificationId)
      .select()
      .single();
      
    if (error) throw error;
    return data;
  },

  async subscribeToNotifications(userId: string, callback: (payload: any) => void) {
    const channel = supabase
      .channel('notifications-changes')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'notifications', filter: `user_id=eq.${userId}` }, callback)
      .subscribe();
      
    return () => supabase.removeChannel(channel);
  }
};
