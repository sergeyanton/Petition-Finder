import create from 'zustand';

interface UserState {
    userId: number | null;
    token: string | null;
    isLoggedIn: boolean;
    login: (userId: number, token: string) => void;
    logout: () => void;
}

const useUserStore = create<UserState>((set) => ({
    userId: localStorage.getItem('userId') !== null ? parseInt(localStorage.getItem('userId') as string) : null,
    token: localStorage.getItem('token') !== null ? localStorage.getItem('token') : null,
    isLoggedIn: localStorage.getItem('userId') !== null &&
            localStorage.getItem('token') !== null &&
            localStorage.getItem('isLoggedIn') === 'true',

    login: (userId, token) => {
        set(() => ({
            userId,
            token,
            isLoggedIn: true,
        }));
        localStorage.setItem('userId', userId.toString());
        localStorage.setItem('token', token);
        localStorage.setItem('isLoggedIn', 'true');
    },
    logout: () => {
        set(() => ({
            userId: null,
            token: null,
            isLoggedIn: false,
        }));
        localStorage.removeItem('userId');
        localStorage.removeItem('token');
        localStorage.removeItem('isLoggedIn');
    },
}));

export default useUserStore;