'use client'
import React, { useEffect, useState, useContext } from "react";
import { supabase } from "./services/supaBaseclient";
import { UserDetailContext } from "@/context/UserDetailContext";

export default function Provider({ children }) {
    const [user, setuser] = useState()
    useEffect(() => {
        CreateNewUser()
    }, [])

    const CreateNewUser = () => {
        supabase.auth.getUser().then(async ({ data: { user } }) => {
            if (!user) return;
            
            // Get current timestamp for last_login
            const currentTime = new Date().toISOString();
            
            let { data: Users, error } = await supabase
                .from('users')
                .select("*")
                .eq('email', user?.email);
                
            console.log(Users);
            
            if (Users?.length === 0) {
                // Extract first and last name from user metadata
                const fullName = user?.user_metadata?.name || '';
                const nameParts = fullName.split(' ');
                const firstName = nameParts[0] || '';
                const lastName = nameParts.length > 1 ? nameParts.slice(1).join(' ') : '';
                
                // Create new user with the new schema
                let { data, error } = await supabase
                    .from('users')
                    .insert([
                        {
                            email: user?.email,
                            name: user?.user_metadata?.name,
                            picture: user?.user_metadata?.picture,
                            first_name: firstName,
                            last_name: lastName,
                            email_verified: user?.email_verified || false,
                            user_role: 'user',
                            account_status: 'active',
                            last_login: currentTime,
                            login_count: 1
                        },
                    ]);
                    
                if (error) {
                    console.error("Error creating user:", error);
                    return;
                }
                
                console.log("New user created:", data);
                setuser(data);
                return;
            }
            
            // Update existing user's login information
            const { data: updatedUser, error: updateError } = await supabase
                .from('users')
                .update({
                    last_login: currentTime,
                    login_count: (Users[0]?.login_count || 0) + 1,
                    updated_at: currentTime
                })
                .eq('id', Users[0].id)
                .select();
                
            if (updateError) {
                console.error("Error updating user login info:", updateError);
                setuser(Users[0]);
            } else {
                setuser(updatedUser[0] || Users[0]);
            }
        });
    }

    return (
        <UserDetailContext.Provider value={{ user, setuser }}>
            <div>
                {children}
            </div>
        </UserDetailContext.Provider>

    )
}

export const useUser = () => {
    const context = useContext(UserDetailContext)
    return context;
}