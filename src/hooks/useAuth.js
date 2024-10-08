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
    let userId = null;
    let authorize = [];
    let isAuthenticated = false;
    if (token) {
      // TODO: check AuthProvider
      const payload = jwtDecode(token);
      tenant = payload.tenant;
      user = payload.sub;
      userId = payload.userId;
      authorize = payload.scope;
      isAuthenticated = true;
      localStorageUtils.saveToken(token);
      api.defaults.headers.common['Authorization'] = "Bearer " + token;
    }
    else {
      token = null;
    }

    setAuths({token, tenant, user, userId, authorize, isAuthenticated})
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
    api.defaults.headers.common['Authorization'] = null;
    setAuths({
      token: null,
      tenant: null,
      user: null,
      userId: null,
      authorize: [],
      isAuthenticated: false,
    })
  }

  return {auth, setAuth, hasAuthorize, hasAnyAuthorize, hasRole, isAdminApp, logout};
}

export default useAuth;