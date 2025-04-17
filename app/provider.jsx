'use client'
import React, { useEffect, useState ,useContext} from "react";
import { supabase } from "./services/supaBaseclient";
import { UserDetailContext } from "@/context/userDetailContext";

export default function Provider({children}){
    const [user,setuser]=useState()
    useEffect(()=>{
        CreateNewUser()
    },[])

    const CreateNewUser=()=>{
        supabase.auth.getUser().then(async ({data:{user}})=>{
            let { data: Users, error } = await supabase
                                        .from('users')
                                        .select("*")
                                        .eq('email',user?.email);
            console.log(Users);
            if(Users?.length==0){
                let { data, error } = await supabase
                .from('users')
                .insert([
                    {
                        email: user?.email,
                        name: user?.user_metadata?.name,
                        picture:user?.user_metadata?.picture
                    },
                ]);
                console.log(data);
                setuser(data);
                return;
             }
             setuser(Users[0]);
                                        




        });
    }

    return (
        <UserDetailContext.Provider value={{user,setuser}}>
            <div>
        {children}
        </div>
        </UserDetailContext.Provider>
        
    )
}

export const useUser=()=>{
    const context=useContext(UserDetailContext)
    return context;
}