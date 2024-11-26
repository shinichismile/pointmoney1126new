import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { User, UserProfile } from '../types';

interface AuthState {
  user: User | null;
  users: Record<string, User>;
  isAuthenticated: boolean;
  customIcon?: string;
  login: (user: Omit<User, 'password'>) => void;
  logout: () => void;
  updateProfile: (updates: Partial<User & { profile: UserProfile }>) => void;
  updateIcon: (base64: string) => void;
  updateAvatar: (avatarUrl: string) => void;
  updatePoints: (points: number) => void;
  updateUserPoints: (userId: string, points: number) => void;
  getUser: (userId: string) => User | null;
}

// Initial users data
const INITIAL_USERS: Record<string, User> = {
  'kkkk1111': {
    id: 'kkkk1111',
    loginId: 'kkkk1111',
    name: '管理者',
    email: 'admin@pointmoney.com',
    role: 'admin' as const,
    points: 0,
    status: 'active',
    joinedAt: '2024-01-01',
    totalEarned: 0,
  },
  'kkkk2222': {
    id: 'kkkk2222',
    loginId: 'kkkk2222',
    name: 'テストワーカー',
    email: 'worker@pointmoney.com',
    role: 'worker' as const,
    points: 0,
    status: 'active',
    joinedAt: '2024-01-15',
    totalEarned: 0,
  },
};

// Authentication credentials (not stored in state)
export const AUTH_CREDENTIALS = {
  'kkkk1111': 'kkkk1111',
  'kkkk2222': 'kkkk2222',
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      users: INITIAL_USERS,
      isAuthenticated: false,
      customIcon: undefined,

      login: (userData) => {
        const currentUsers = get().users;
        const updatedUser = {
          ...currentUsers[userData.id],
          lastLogin: new Date().toISOString(),
        };
        
        set({ 
          user: updatedUser,
          users: {
            ...currentUsers,
            [userData.id]: updatedUser,
          },
          isAuthenticated: true,
        });
      },

      logout: () => set({ user: null, isAuthenticated: false }),

      updateProfile: (updates) =>
        set((state) => {
          if (!state.user) return state;

          const updatedUser = { ...state.users[state.user.id], ...updates };
          return {
            user: updatedUser,
            users: {
              ...state.users,
              [state.user.id]: updatedUser,
            },
          };
        }),

      updateIcon: (base64) => set({ customIcon: base64 }),

      updateAvatar: (avatarUrl) =>
        set((state) => {
          if (!state.user) return state;

          const updatedUser = { ...state.users[state.user.id], avatarUrl };
          return {
            user: updatedUser,
            users: {
              ...state.users,
              [state.user.id]: updatedUser,
            },
          };
        }),

      updatePoints: (points) =>
        set((state) => {
          if (!state.user) return state;

          const updatedUser = { 
            ...state.users[state.user.id], 
            points,
            totalEarned: state.users[state.user.id].totalEarned + points,
          };
          return {
            user: updatedUser,
            users: {
              ...state.users,
              [state.user.id]: updatedUser,
            },
          };
        }),

      updateUserPoints: (userId, points) =>
        set((state) => {
          const currentUser = state.users[userId];
          if (!currentUser) return state;

          const updatedUser = { 
            ...currentUser, 
            points,
            totalEarned: currentUser.totalEarned + points,
          };

          const updates = {
            users: {
              ...state.users,
              [userId]: updatedUser,
            },
          };

          // If the updated user is the current user, update that too
          if (state.user?.id === userId) {
            updates.user = updatedUser;
          }

          return updates;
        }),

      getUser: (userId) => get().users[userId] || null,
    }),
    {
      name: 'auth-storage',
      version: 1,
      migrate: (persistedState: any, version: number) => {
        return {
          ...persistedState,
          users: {
            ...INITIAL_USERS,
            ...persistedState.users,
          },
        };
      },
    }
  )
);