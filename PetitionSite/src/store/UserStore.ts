import create from 'zustand';

interface UserState {
    userId: number | null;
    token: string | null;
    isLoggedIn: boolean;
    login: (userId: number, token: string) => void;
    logout: () => void;
}

const useUserStore = create<UserState>((set, get) => ({
    userId: null,
    token: null,
    isLoggedIn: false,
    login: (userId, token) => {
        set((state) => ({
            userId,
            token,
            isLoggedIn: true,
        }));
        localStorage.setItem('userId', userId.toString());
        localStorage.setItem('token', token);
    },
    logout: () => {
        set((state) => ({
            userId: null,
            token: null,
            isLoggedIn: false,
        }));
        localStorage.removeItem('userId');
        localStorage.removeItem('token');
    },
}));

export default useUserStore;