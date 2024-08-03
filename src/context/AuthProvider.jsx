import { jwtDecode } from "jwt-decode";
import { localStorageUtils } from "@/utils";
import { createContext, useState } from "react";

export const AuthContext = createContext();

export const AuthProvider = ({children}) => {
  let user = null;
  let tenant = null;
  const token = localStorageUtils.getToken();
  let authorize = [];
  let isAuthenticated = false;

  if (token) {
    try {
      const payload = jwtDecode(token);
      user = payload.sub;
      tenant = payload.tenant;
      authorize = payload.scope;
      isAuthenticated = true;
    } catch (error) {
      console.log("Load failed!");
    }
    
  }
  
  const [auth, setAuths] = useState({
    user,
    tenant,
    token,
    authorize,
    isAuthenticated,
  });

  return (
    <AuthContext.Provider value={{auth, setAuths}}>
      {children}
    </AuthContext.Provider>
  );
}