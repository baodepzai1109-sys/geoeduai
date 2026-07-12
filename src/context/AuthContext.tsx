"use client";

import {
    createContext,
    useContext,
    useEffect,
    useState,
} from "react";

import { supabase } from "@/lib/supabase";

type UserProfile = {
    id: string;
    full_name: string;
    email: string;
    avatar_url: string;
    bio: string;
    role: string;
};

type AuthContextType = {
    user: UserProfile | null;
    loading: boolean;
    refreshUser: () => Promise<void>;
    logout: () => Promise<void>;
};

const AuthContext =
    createContext<AuthContextType>(
        {} as AuthContextType
    );

export function AuthProvider({
    children,
}: {
    children: React.ReactNode;
}) {
    const [user, setUser] =
        useState<UserProfile | null>(null);

    const [loading, setLoading] =
        useState(true);

    async function refreshUser() {
        const {
            data: { session },
        } = await supabase.auth.getSession();

        if (!session) {
            setUser(null);
            setLoading(false);
            return;
        }

        const { data } = await supabase
            .from("profiles")
            .select("*")
            .eq("id", session.user.id)
            .single();

        if (data) {
setUser({
    id: data.id,
    full_name: data.full_name,
    email: data.email,
    avatar_url: data.avatar_url,
    bio: data.bio,
    role: data.role,
});
        }

        setLoading(false);
    }

    async function logout() {
        await supabase.auth.signOut();
        setUser(null);
    }

    useEffect(() => {
        refreshUser();

        const {
            data: listener,
        } = supabase.auth.onAuthStateChange(() => {
            refreshUser();
        });

        return () => {
            listener.subscription.unsubscribe();
        };
    }, []);

    return (
        <AuthContext.Provider
            value={{
                user,
                loading,
                refreshUser,
                logout,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    return useContext(AuthContext);
}   