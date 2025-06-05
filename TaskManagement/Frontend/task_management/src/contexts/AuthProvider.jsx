import { authApi } from "@/services/authApi";
import { useCallback, useEffect, useMemo, useState } from "react";
import { AuthContext } from "./useAuth";



export function AuthProvider({ children }) {

    const [user, setUser]       = useState(null);
    const [token, setToken]      = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError]     = useState(null);
    
      // Checking user already logged in
    
      useEffect(() => {
        const storedToken = localStorage.getItem("token");
        const storedUser  = localStorage.getItem("user");
      
        if (storedToken && storedUser) {
            setToken(storedToken);
            setUser(JSON.parse(storedUser))
        }
        setLoading(false);
      }, []);

        // Login Function
      
        const login = useCallback( async (username, password) => {
            try {
                setLoading(true);
                setError(null);

                const response      = await authApi.login({username, password});
                const {token, user} = response;
                // save in state
                setToken(token);
                setUser(user);
                // 

                localStorage.setItem("token", token);
                localStorage.setItem("user", JSON.stringify(user));

                return true;
            }
            catch (error) {
                setError(error.response?.data?.message || "Login failed");
                return false;
            } finally {
                setLoading(false);
            }
        }, [])


          // Logout 
        
          const logout = useCallback(() => {
            setUser(null);
            setToken(null);
            localStorage.removeItem("token");
            localStorage.removeItem("user");
          }, []);


            // register
          
            const register = useCallback( async (userData) => {
                try {
                    setLoading(true);
                    setError(null);

                    await authApi.register(userData);
                    return true;
                }
                catch(error) {
                    setError(error.response?.data?.message || "Registration failed");
                    return false;
                } finally {
                    setLoading(false);
                }
            }, []);


      // context value 
    const value =  useMemo( () => ({
      user,
      token,
      isAuthenticated: !!token,
      loading,
      error,
      login,
      logout,
      register
    }), [user, token, loading, error, login, logout, register]);
    

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>

}


