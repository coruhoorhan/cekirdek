import React, { createContext, useState, useEffect, useContext, ReactNode } from 'react';
import { Session, User } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabaseClient';

// Profile tipini tanımlayalım (Supabase'deki profiles tablonuza göre)
export interface UserProfile {
  id: string;
  role: 'admin' | 'teacher' | 'parent' | string; // rolleri genişletebiliriz
  name: string;
  is_active: boolean; // Eklendi
  // Diğer profil alanları eklenebilir (avatar_url vb.)
}

interface AuthContextType {
  session: Session | null;
  user: User | null;
  profile: UserProfile | null;
  loading: boolean;
  signOut: () => Promise<void>;
  profileNotFound: boolean;
  isAccountActive: boolean; // Yeni state
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [profileNotFound, setProfileNotFound] = useState(false);
  const [isAccountActive, setIsAccountActive] = useState(true); // Yeni state, varsayılan true

  // Profil bilgilerini yeniden almak için fonksiyon
  const fetchUserProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('id, role, name, is_active') // is_active eklendi
        .eq('id', userId)
        .single();

      if (error) {
        console.error('Error fetching user profile:', error.message);
        if (error.code === 'PGRST116' || error.message.includes("relation \"profiles\" does not exist")) {
            console.warn("Profile not found or 'profiles' table does not exist.");
            setProfileNotFound(true);
            setIsAccountActive(false); // Profil yoksa aktif değil gibi davran
        }
        return null;
      }
      
      if (data) {
        if (data.is_active === false) {
          console.warn(`User account ${userId} is not active.`);
          setProfile(null); // Pasif kullanıcı için profili set etme
          setUser(null); // Kullanıcıyı da null yapalım
          setSession(null); // Oturumu da null yapalım
          setIsAccountActive(false);
          // Supabase'den de çıkış yapalım ki token geçerli kalmasın
          await supabase.auth.signOut();
          // Yönlendirme veya mesaj gösterme burada veya useEffect'te yapılabilir
          return null;
        }
        setProfile(data as UserProfile);
        setProfileNotFound(false);
        setIsAccountActive(true);
        return data as UserProfile;
      } else {
        console.warn(`No profile found for user ID: ${userId}`);
        setProfileNotFound(true);
        setIsAccountActive(false);
        return null;
      }
    } catch (e) {
      console.error('Unexpected error fetching profile:', e);
      setProfileNotFound(true);
      setIsAccountActive(false);
      return null;
    }
  };

  // Profil bilgilerini dışarıdan yenilemek için fonksiyon
  const refreshProfile = async () => {
    if (!user) return; // Eğer kullanıcı yoksa (örneğin pasif olduğu için null yapıldıysa) işlem yapma

    // Eğer refreshProfile çağrıldığında hesap aktif değilse, tekrar fetch denemeden önce aktif olduğunu varsayalım.
    // Bu, admin tarafından hesap aktif edildikten sonra kullanıcının login olmadan refresh edebilmesi için.
    // Ancak bu senaryo genellikle login sonrası olacağı için fetchUserProfile zaten çalışır.
    // Şimdilik basit tutalım:
    // setIsAccountActive(true); // Yeniden denemeden önce aktif varsayalım, fetchUserProfile düzeltecektir.
    
    setLoading(true);
    await fetchUserProfile(user.id); // user.id burada null olabilir, fetchUserProfile bunu handle etmeli.
                                     // Ancak user null ise zaten yukarıdaki if'ten dönüyoruz.
    setLoading(false);
  };


  const signOut = async (options?: { showInactiveMessage?: boolean }) => {
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
      if (!options?.showInactiveMessage) { // Eğer özel bir durumla çıkış yapılmadıysa hesabı aktif say
        setIsAccountActive(true);
      }
    } catch (error) {
      console.error('Unexpected error signing out:', error);
    } finally {
      setLoading(false);
    }
  };


  // useEffect içindeki onAuthStateChange'de de isAccountActive resetlenebilir
  useEffect(() => {
    let authListener: { subscription: { unsubscribe: () => void } } | null = null;
    
    const setupAuth = async () => {
      setLoading(true);
      setIsAccountActive(true); // Her setup başında aktif varsay
      
      try {
        const { data: { session: currentSession }, error: sessionError } = await supabase.auth.getSession();

        if (sessionError) {
          console.error("Error fetching session:", sessionError.message);
          setLoading(false);
          return;
        }

        if (currentSession?.user) {
          const userProfile = await fetchUserProfile(currentSession.user.id);
          // fetchUserProfile içinde session, user, profile set ediliyor (pasifse null'a çekiliyor)
          if (userProfile) { // Sadece profil aktif ve bulunduysa session ve user'ı set et
            setSession(currentSession);
            setUser(currentSession.user);
          }
        } else {
          setSession(null);
          setUser(null);
          setProfile(null);
        }

        const { data: listener } = supabase.auth.onAuthStateChange(async (_event, newSession) => {
          setIsAccountActive(true); // State değişikliğinde aktif varsay, fetchUserProfile kontrol edecek
          if (newSession?.user) {
            const userProfile = await fetchUserProfile(newSession.user.id);
            if (userProfile) {
              setSession(newSession);
              setUser(newSession.user);
            } else {
              // fetchUserProfile zaten session/user/profile'ı null'a çekti ve isAccountActive'i false yaptı
              // Bu durumda session ve user'ı null yapmak daha doğru olabilir.
              // Zaten fetchUserProfile içinde setSession(null) ve setUser(null) yapılıyor.
            }
          } else {
            setSession(null);
            setUser(null);
            setProfile(null);
            setProfileNotFound(false);
            //setIsAccountActive(true); // Kullanıcı çıkış yaptığında hesabı tekrar aktif sayabiliriz, login'de kontrol edilecek
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


  const value = {
    session,
    user,
    profile,
    loading,
    signOut,
    profileNotFound,
    isAccountActive, // Context değerine eklendi
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
