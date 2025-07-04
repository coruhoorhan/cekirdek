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
  profileNotFound: boolean;
  refreshProfile: () => Promise<void>; // Profil yenileme fonksiyonu eklendi
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [profileNotFound, setProfileNotFound] = useState(false);

  // Profil bilgilerini yeniden almak için fonksiyon
  const fetchUserProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('id, role, name') 
        .eq('id', userId)
        .single();

      if (error) {
        console.error('Error fetching user profile:', error.message);
        if (error.code === 'PGRST116' || error.message.includes("relation \"profiles\" does not exist")) {
            console.warn("Profile not found or 'profiles' table does not exist. This might be a new user or an RLS issue.");
            setProfileNotFound(true);
        }
        return null;
      }
      
      if (data) {
        setProfile(data as UserProfile);
        setProfileNotFound(false);
        return data as UserProfile;
      } else {
        console.warn(`No profile found for user ID: ${userId}`);
        setProfileNotFound(true);
        return null;
      }
    } catch (e) {
      console.error('Unexpected error fetching profile:', e);
      setProfileNotFound(true);
      return null;
    }
  };

  // Profil bilgilerini dışarıdan yenilemek için fonksiyon
  const refreshProfile = async () => {
    if (!user) return;
    
    setLoading(true);
    await fetchUserProfile(user.id);
    setLoading(false);
  };

  useEffect(() => {
    let authListener: { subscription: { unsubscribe: () => void } } | null = null;
    
    const setupAuth = async () => {
      setLoading(true);
      
      try {
        // Mevcut oturumu al
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

        // Auth state değişikliklerini dinle
        const { data: listener } = supabase.auth.onAuthStateChange(async (_event, newSession) => {
          setSession(newSession);
          setUser(newSession?.user ?? null);
          
          if (newSession?.user) {
            await fetchUserProfile(newSession.user.id);
          } else {
            setProfile(null);
            setProfileNotFound(false);
          }
        });

        authListener = listener;
      } catch (error) {
        console.error("Error setting up auth:", error);
      } finally {
        setLoading(false);
      }
    };

    setupAuth();

    return () => {
      if (authListener?.subscription?.unsubscribe) {
        authListener.subscription.unsubscribe();
      }
    };
  }, []);

  const signOut = async () => {
    try {
      setLoading(true);
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.error('Error signing out:', error.message);
      }
      setSession(null);
      setUser(null);
      setProfile(null);
      setProfileNotFound(false);
    } catch (error) {
      console.error('Unexpected error signing out:', error);
    } finally {
      setLoading(false);
    }
  };

  const value = {
    session,
    user,
    profile,
    loading,
    signOut,
    profileNotFound,
    refreshProfile,
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
