import { useState, useEffect } from "react"
import { supabase } from "@/app/services/supaBaseclient"

function useSettingsPage() {
  const [userData, setUserData] = useState({
    email: "",
    firstName: "",
    lastName: "",
    emailVerified: false,
    picture: "",
    userRole: "user",
    accountStatus: "active",
    credits: 0,
    createdAt: null,
    lastLogin: null,
    loginCount: 0
  })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    fetchUser()
  }, [])

  const fetchUser = async () => {
    setLoading(true)
    setError("")
    setSuccess("")
    
    try {
      if (!supabase.auth) {
        throw new Error("Supabase client is not initialized with auth.")
      }
      
      // Get authenticated user
      const { data: authData, error: authError } = await supabase.auth.getUser()
      
      if (authError) {
        console.error("Auth error:", authError);
        throw new Error(authError.message || "Authentication failed")
      }
      
      if (!authData?.user) {
        throw new Error("User not authenticated.")
      }
      
      const email = authData.user.email;
      if (!email) {
        throw new Error("No email found for authenticated user");
      }
      console.log("Auth user email:", email);
      
      // Get detailed user data from the users table
      let dbUser = null;
      
      try {
        // Try to fetch user by email
        const { data: userResult, error: dbError } = await supabase
          .from('users')
          .select('*')
          .eq('email', email);
        
        if (dbError) {
          console.warn("Database error fetching user:", dbError);
          throw new Error(dbError.message || "Database error");
        } else {
          if (userResult && userResult.length > 0) {
            dbUser = userResult[0]; // Use the first match
            console.log("DB user found:", dbUser);
          } else {
            console.log("User not found in database, using auth data only");
          }
        }
      } catch (dbQueryError) {
        console.error("Database query error:", dbQueryError);
        // Continue with auth user data only
      }
      
      // If no database record exists, create one with basic auth data
      if (!dbUser) {
        const userProfile = {
          id: userId,
          email: authData.user.email,
          first_name: authData.user.user_metadata?.name?.split(' ')[0] || '',
          last_name: authData.user.user_metadata?.name?.split(' ').slice(1).join(' ') || '',
          created_at: new Date().toISOString(),
          email_verified: authData.user.email_verified || false,
          user_role: 'user',
          account_status: 'active',
          credits: 0,
          login_count: 1
        };
        
        // Try to insert the new user
        try {
          const { error: insertError } = await supabase
            .from('users')
            .insert(userProfile);
            
          if (!insertError) {
            dbUser = userProfile;
          } else {
            console.warn("Failed to insert new user profile:", insertError);
          }
        } catch (insertErr) {
          console.warn("Error creating user profile:", insertErr);
        }
      }
      
      // Fall back to auth data if we still don't have user data
      const userData = dbUser || {};
      
      // Update state with user data
      setUserData({
        // Instead of using ID, use email as the primary identifier
        email: email,
        firstName: dbUser?.first_name || authData.user.user_metadata?.name?.split(' ')[0] || "",
        lastName: dbUser?.last_name || authData.user.user_metadata?.name?.split(' ').slice(1).join(' ') || "",
        emailVerified: dbUser?.email_verified || authData.user.email_verified || false,
        picture: dbUser?.picture || authData.user.user_metadata?.avatar_url || "",
        userRole: dbUser?.user_role || "user",
        accountStatus: dbUser?.account_status || "active",
        credits: dbUser?.credits || 0,
        createdAt: dbUser?.created_at || authData.user.created_at || null,
        lastLogin: dbUser?.last_login || authData.user.last_sign_in_at || null,
        loginCount: dbUser?.login_count || 0
      });
      
    } catch (err) {
      console.error("Error fetching user data:", err);
      setError(typeof err === 'object' && err !== null ? (err.message || "Failed to load user profile.") : "Unknown error occurred");
    } finally {
      setLoading(false);
    }
  }

  const updateProfile = async (updatedData) => {
    setSaving(true)
    setError("")
    setSuccess("")
    
    try {
      // Only allow updating specific fields
      const { firstName, lastName } = updatedData
      
      // Get authenticated user in case we need to create a profile
      const { data: authData, error: authError } = await supabase.auth.getUser()
      
      if (authError) {
        throw new Error(authError.message || "Authentication failed")
      }
      
      const email = authData.user.email;
      if (!email) {
        throw new Error("No email found for authenticated user");
      }
      
      // Check if user exists with this email
      const { data: existingUsers, error: checkError } = await supabase
        .from('users')
        .select('id')
        .eq('email', email);
        
      if (checkError) {
        console.error("Error checking for existing user:", checkError);
        throw new Error(checkError.message || "Database error");
      }
      
      if (!existingUsers || existingUsers.length === 0) {
        // User doesn't exist, create new record
        const { error: insertError } = await supabase
          .from('users')
          .insert({
            // Don't include ID field - let the database generate it
            first_name: firstName,
            last_name: lastName,
            email: email,
            email_verified: authData.user.email_verified || false,
            user_role: 'user',
            account_status: 'active',
            credits: 0,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
            login_count: 1
          });
          
        if (insertError) {
          console.error("Insert error:", insertError);
          throw new Error(insertError.message || "Failed to create user profile");
        }
      } else {
        // Update existing user by email
        const { error: updateError } = await supabase
          .from('users')
          .update({
            first_name: firstName,
            last_name: lastName,
            updated_at: new Date().toISOString()
          })
          .eq('email', email);
        
        if (updateError) {
          console.error("Update error:", updateError);
          throw new Error(updateError.message || "Failed to update profile");
        }
      }
      
      // Update local state with new data
      setUserData(prev => ({
        ...prev,
        firstName,
        lastName
      }));
      
      setSuccess("Profile updated successfully!");
      
    } catch (err) {
      console.error("Error updating profile:", err);
      setError(typeof err === 'object' && err !== null ? (err.message || "Failed to update profile.") : "Unknown error occurred");
    } finally {
      setSaving(false);
    }
  }

  return {
    userData,
    loading,
    error,
    success,
    saving,
    updateProfile,
    refreshUser: fetchUser
  }
}

export default useSettingsPage
