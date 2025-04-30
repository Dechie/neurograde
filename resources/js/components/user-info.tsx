// import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
// import { useInitials } from '@/hooks/use-initials';
// import { type User } from '@/types';

// export function UserInfo({ user, showEmail = false }: { user: User; showEmail?: boolean }) {
//     const getInitials = useInitials();

//     return (
//         <>
//             <Avatar className="h-8 w-8 overflow-hidden rounded-full">
//                 <AvatarImage src={user.avatar} alt={user.name} />
//                 <AvatarFallback className="rounded-lg bg-neutral-200 text-black dark:bg-neutral-700 dark:text-white">
//                     {getInitials(user.name)}
//                 </AvatarFallback>
//             </Avatar>
//             <div className="grid flex-1 text-left text-sm leading-tight">
//                 <span className="truncate font-medium">{user.name}</span>
//                 {showEmail && <span className="text-muted-foreground truncate text-xs">{user.email}</span>}
//             </div>
//         </>
//     );
// }

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useInitials } from '@/hooks/use-initials';
// Import the User type from your types file
import { User } from '@/types';

// Define the prop type for UserInfo, ensuring first/last names are expected
// Allow user to be null or undefined for safety, especially if AppLayout is used on pages
// that might not have an authenticated user prop yet (though dashboard should).
interface UserInfoProps {
     user: User | null | undefined;
     showEmail?: boolean;
}

export function UserInfo({ user, showEmail = false }: UserInfoProps) {
    const getInitials = useInitials(); // This hook returns the function

    // Safely get first and last names, handling null/undefined user
    const firstName = user?.first_name;
    const lastName = user?.last_name;

    // Derive the full name from first and last names
    // Handle cases where user, first, or last might be missing or empty strings
    const fullName = user ? `${firstName || ''} ${lastName || ''}`.trim() : '';

    // Determine what to display as the main text (full name, or email if name is empty)
    const displayName = fullName || user?.email || 'User'; // Use full name, or email, or a default 'User'

    // Determine fallback text for Avatar (initials from derived fullName or a placeholder)
    // Use getInitials if fullName is not empty, otherwise use the first char of display name
    const avatarFallbackText = fullName ? getInitials(fullName) : displayName.charAt(0).toUpperCase();


    // Only render the user info block if the user object exists
    if (!user) {
        // You can return null, a loading state, or a placeholder here
        return null; // Or <div>Loading User Info...</div>;
    }


    return (
        <>
            <Avatar className="h-8 w-8 overflow-hidden rounded-full">
                {/* Use safe access for avatar src. Use fullName for alt text */}
                <AvatarImage src={user.avatar} alt={fullName || 'User Avatar'} />
                <AvatarFallback className="rounded-lg bg-neutral-200 text-black dark:bg-neutral-700 dark:text-white">
                    {avatarFallbackText} {/* Use the derived fallback text */}
                </AvatarFallback>
            </Avatar>
            <div className="grid flex-1 text-left text-sm leading-tight">
                {/* Use the display name */}
                <span className="truncate font-medium">{displayName}</span>
                {/* Only show email if showEmail is true and email exists on the user object */}
                {showEmail && user.email && <span className="text-muted-foreground truncate text-xs">{user.email}</span>}
            </div>
        </>
    );
}