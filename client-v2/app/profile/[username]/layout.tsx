
import AuthProvider from '@/providers/AuthProvider';
import PublicProfileProvider from '@/providers/PublicProfileProvider';
import * as React from 'react'

const ProfileLayout = ({ children, params }: {
    children: React.ReactNode,
    params: React.Usable<{ username: string }>
}): React.ReactElement => {

    // Extracted username from params
    const { username } = React.use(params);
    return (
        <AuthProvider>
            <PublicProfileProvider
                username={username}
            >
                {children}
            </PublicProfileProvider>
        </AuthProvider>
    );
};

export default ProfileLayout;