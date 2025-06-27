import React, { createContext, useState, useEffect, useContext, ReactNode } from 'react';
import { Session, User } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabaseClient';

// Profile tipini tanımlayalım (Supabase'deki profiles tablonuza göre)
export interface UserProfile {
  id: string;
  role: 'admin' | 'teacher' | 'parent' | string; // rolleri genişletebiliriz
  name: string;
  // Diğer profil alanları eklenebilir (avatar_url vb.)
}

interface AuthContextType {
  session: Session | null;
  user: User | null;
  profile: UserProfile | null;
  loading: boolean;
  signOut: () => Promise<void>;
  // signIn fonksiyonu genellikle login sayfasında direkt supabase.auth.signInWithPassword ile çağrılır,
  // ama gerekirse buraya da eklenebilir.
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSessionAndProfile = async () => {
      setLoading(true);
      const { data: { session: currentSession }, error: sessionError } = await supabase.auth.getSession();

      if (sessionError) {
        console.error("Error fetching session:", sessionError.message);
        setLoading(false);
        return;
      }

      setSession(currentSession);
      setUser(currentSession?.user ?? null);

      if (currentSession?.user) {
        await fetchUserProfile(currentSession.user.id);
      } else {
        setProfile(null);
      }
      setLoading(false);
    };

    fetchSessionAndProfile();

    const { data: authListener } = supabase.auth.onAuthStateChange(async (_event, newSession) => {
      setLoading(true);
      setSession(newSession);
      setUser(newSession?.user ?? null);
      if (newSession?.user) {
        await fetchUserProfile(newSession.user.id);
      } else {
        setProfile(null);
      }
      setLoading(false);
    });

    return () => {
      authListener?.subscription.unsubscribe(); // Doğru unsubscribe metodu
    };
  }, []);

  const fetchUserProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('id, role, name') // İhtiyaç duyulan alanları seçin
        .eq('id', userId)
        .single();

      if (error) {
        console.error('Error fetching user profile:', error.message);
        setProfile(null);
        // Kullanıcı yeni kaydolmuş ve trigger henüz çalışmamış olabilir,
        // ya da RLS engelliyor olabilir (ama kendi profilini okuyabilmeli).
        // Bu durumu loglamak iyi olur.
        if (error.code === 'PGRST116' || error.message.includes("relation \"profiles\" does not exist")) {
            console.warn("Profile not found or 'profiles' table does not exist. This might be a new user or an RLS issue.");
        }
        return;
      }
      if (data) {
        setProfile(data as UserProfile);
      } else {
        setProfile(null);
        console.warn(`No profile found for user ID: ${userId}`);
      }
    } catch (e) {
      console.error('Unexpected error fetching profile:', e);
      setProfile(null);
    }
  };

  const signOut = async () => {
    // setLoading(true); // Opsiyonel: çıkış işlemi çok hızlı olduğu için anlık bir loading state değişimi fark edilmeyebilir.
                        // Eğer çıkış sonrası yönlendirme veya başka async işlemler varsa eklenebilir.
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error('Error signing out:', error.message);
    }
    // onAuthStateChange listener geri kalanı halledecek (session, user, profile'ı null yapacak)
    // ve setLoading(false) yapacak.
  };

  const value = {
    session,
    user,
    profile,
    loading,
    signOut,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
