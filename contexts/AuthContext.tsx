import React, { createContext, useContext, useEffect, useState } from 'react';
import { Session, User } from '@supabase/supabase-js';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { supabase } from '@/lib/supabase';
import { Database } from '@/types/database';
import { DevProfile, getDevProfile, getDefaultDevProfile } from '@/lib/devProfiles';
import Constants from 'expo-constants';

type Profile = Database['public']['Tables']['profiles']['Row'];

interface AuthContextType {
  session: Session | null;
  user: User | null;
  profile: Profile | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, username: string) => Promise<void>;
  signOut: () => Promise<void>;
  refreshProfile: () => Promise<void>;
  // Dev mode specific
  devProfile: DevProfile | null;
  switchDevProfile: (profileId: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const DEV_MODE = Constants.expoConfig?.extra?.EXPO_PUBLIC_DEV_MODE === 'true';
const DEV_PROFILE_KEY = '@wishhive:dev_profile';

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [devProfile, setDevProfile] = useState<DevProfile | null>(null);

  useEffect(() => {
    if (DEV_MODE) {
      console.log('🔧 DEV_MODE:', DEV_MODE);
      loadDevProfile();
    } else {
      loadRealAuth();
    }
  }, []);

  const loadDevProfile = async () => {
    try {
      // Try to load saved dev profile from storage
      const savedProfileId = await AsyncStorage.getItem(DEV_PROFILE_KEY);
      let selectedProfile: DevProfile;

      if (savedProfileId) {
        selectedProfile = getDevProfile(savedProfileId) || getDefaultDevProfile();
      } else {
        selectedProfile = getDefaultDevProfile();
      }

      setDevProfile(selectedProfile);
      setProfile(selectedProfile.profile);

      // Create mock user and session
      const mockUser: User = {
        id: selectedProfile.id,
        app_metadata: {},
        user_metadata: { username: selectedProfile.profile.username },
        aud: 'authenticated',
        created_at: selectedProfile.profile.created_at,
        email: `${selectedProfile.profile.username.toLowerCase()}@dev.test`,
      } as User;

      const mockSession: Session = {
        access_token: 'dev-token',
        refresh_token: 'dev-refresh',
        expires_in: 3600,
        token_type: 'bearer',
        user: mockUser,
      } as Session;

      setUser(mockUser);
      setSession(mockSession);
    } catch (error) {
      console.error('Error loading dev profile:', error);
      const defaultProfile = getDefaultDevProfile();
      setDevProfile(defaultProfile);
      setProfile(defaultProfile.profile);
    } finally {
      setLoading(false);
    }
  };

  const loadRealAuth = async () => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      if (session?.user) {
        loadProfile(session.user.id);
      } else {
        setLoading(false);
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        if (session?.user) {
          loadProfile(session.user.id);
        } else {
          setProfile(null);
          setLoading(false);
        }
      }
    );

    return () => subscription.unsubscribe();
  };

  const loadProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .maybeSingle();

      if (error) throw error;
      setProfile(data);
    } catch (error) {
      console.error('Error loading profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const switchDevProfile = async (profileId: string) => {
    if (!DEV_MODE) return;

    const selectedProfile = getDevProfile(profileId);
    if (!selectedProfile) return;

    try {
      // Save selected profile to storage
      await AsyncStorage.setItem(DEV_PROFILE_KEY, profileId);

      setDevProfile(selectedProfile);
      setProfile(selectedProfile.profile);

      // Update mock user
      const mockUser: User = {
        id: selectedProfile.id,
        app_metadata: {},
        user_metadata: { username: selectedProfile.profile.username },
        aud: 'authenticated',
        created_at: selectedProfile.profile.created_at,
        email: `${selectedProfile.profile.username.toLowerCase()}@dev.test`,
      } as User;

      setUser(mockUser);

      console.log('✅ Switched to dev profile:', selectedProfile.profile.username);
    } catch (error) {
      console.error('Error switching dev profile:', error);
    }
  };

  const signIn = async (email: string, password: string) => {
    if (DEV_MODE) {
      console.log('⚠️ Sign in disabled in dev mode');
      return;
    }
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) throw error;
  };

  const signUp = async (email: string, password: string, username: string) => {
    if (DEV_MODE) {
      console.log('⚠️ Sign up disabled in dev mode');
      return;
    }
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          username,
        },
      },
    });
    if (error) throw error;
  };

  const signOut = async () => {
    if (DEV_MODE) {
      console.log('⚠️ Sign out disabled in dev mode');
      return;
    }
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  };

  const refreshProfile = async () => {
    if (DEV_MODE) {
      // In dev mode, just reload the current dev profile
      if (devProfile) {
        setProfile(devProfile.profile);
      }
      return;
    }
    if (user) {
      await loadProfile(user.id);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        session,
        user,
        profile,
        loading,
        signIn,
        signUp,
        signOut,
        refreshProfile,
        devProfile,
        switchDevProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
