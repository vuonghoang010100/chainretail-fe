import { useContext } from "react";
import { jwtDecode } from "jwt-decode";
import { AuthContext } from "@/context/AuthProvider";
import { ROLE_PREFIX, ROLES } from "@/constants/Authorization";
import { localStorageUtils } from "@/utils";
import { api } from "@/apis/configs/axiosConfig";


const useAuth = () => {
  const {auth, setAuths} = useContext(AuthContext);

  function setAuth(token) {
    let tenant = null;
    let user = null;
    let authorize = [];
    let isAuthenticated = false;
    if (token) {
      // TODO: check AuthProvider
      const payload = jwtDecode(token);
      tenant = payload.tenant;
      user = payload.sub;
      authorize = payload.scope;
      isAuthenticated = true;
      localStorageUtils.saveToken(token);
      api.defaults.headers.common['Authorization'] = "Bearer " + token;
    }

    setAuths({token, tenant, user, authorize, isAuthenticated})
  }

  function hasAuthorize(author) {
    return auth?.authorize.includes(author);
  }
  
  function hasAnyAuthorize(authors = []) {
    return auth?.authorize.find(author => authors.includes(author));
  }
  
  function hasRole(role) {
    return auth?.authorize.includes(ROLE_PREFIX + role);
  }

  function isAdminApp() {
    return hasRole(ROLES.SYSTEM_ADMIN);
  }
  
  function logout() {
    localStorageUtils.deleteToken();
    setAuths({
      token: null,
      tenant: null,
      user: null,
      authorize: [],
      isAuthenticated: false,
    })
  }

  return {auth, setAuth, hasAuthorize, hasAnyAuthorize, hasRole, isAdminApp, logout};
}

export default useAuth;