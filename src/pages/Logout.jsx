import { ROUTE } from "@/constants/AppConstant";
import useAuth from "@/hooks/useAuth";
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";


const Logout = () => {
  const navigate = useNavigate()
  const { logout } = useAuth();
  useEffect(()=> {
    logout();
    navigate(ROUTE.LOGIN.path);
  })

  return <>logout</>;
};

export default Logout;
