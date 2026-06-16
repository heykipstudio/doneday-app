export type Plan = 'free' | 'plus';
export type NotificationTime = '20:00' | '21:00' | '22:00';
export type ReflectionType = 'weekly' | 'monthly';
export type ReflectionStatus = 'pending' | 'completed' | 'skipped' | 'postponed';

export type ReflectionPrompt = {
  prompt: string;
  answer: string;
};

export type Profile = {
  id: string;
  name: string | null;
  plan: Plan;
  notifications_enabled: boolean;
  notification_time: NotificationTime;
  created_at: string;
  updated_at: string;
};

export type DailyEntry = {
  id: string;
  user_id: string;
  entry_date: string;
  entry_1: string | null;
  entry_2: string | null;
  entry_3: string | null;
  created_at: string;
  updated_at: string;
};

export type Reflection = {
  id: string;
  user_id: string;
  type: ReflectionType;
  period_id: string;
  prompts: ReflectionPrompt[];
  status: ReflectionStatus;
  remind_at: string | null;
  created_at: string;
  updated_at: string;
};

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: Profile;
        Insert: Partial<Profile> & { id: string };
        Update: Partial<Profile>;
        Relationships: [];
      };
      daily_entries: {
        Row: DailyEntry;
        Insert: Partial<DailyEntry> & { user_id: string; entry_date: string };
        Update: Partial<DailyEntry>;
        Relationships: [];
      };
      reflections: {
        Row: Reflection;
        Insert: Partial<Reflection> & { user_id: string; type: ReflectionType; period_id: string };
        Update: Partial<Reflection>;
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
  };
};
