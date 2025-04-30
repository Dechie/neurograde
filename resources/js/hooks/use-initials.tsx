// import { useCallback } from 'react';

// export function useInitials() {
//     return useCallback((fullName: string): string => {
//         const names = fullName.trim().split(' ');

//         if (names.length === 0) return '';
//         if (names.length === 1) return names[0].charAt(0).toUpperCase();

//         const firstInitial = names[0].charAt(0);
//         const lastInitial = names[names.length - 1].charAt(0);

//         return `${firstInitial}${lastInitial}`.toUpperCase();
//     }, []);
// }
// use-initials.tsx

import { useCallback } from 'react';

export function useInitials() {
    return useCallback((fullName: string): string => {
        // The function expects a string. The check for fullName being empty string
        // is done by the component calling it (UserInfo now).
        const names = fullName.trim().split(' ');

        if (names.length === 0 || fullName.trim() === '') return ''; // Handle empty string input
        if (names.length === 1) return names[0].charAt(0).toUpperCase();

        const firstInitial = names[0].charAt(0);
        const lastInitial = names[names.length - 1].charAt(0);

        return `${firstInitial}${lastInitial}`.toUpperCase();
    }, []);
}