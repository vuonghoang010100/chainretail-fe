import useAuth from "@/hooks/useAuth";
import AdminSideBar from "./AdminSideBar";
import TenantSideBar from "./TenantSideBar";

const SideBar = () => {
  const {isAdminApp} = useAuth();

  if (isAdminApp()) {
    return <AdminSideBar/>
  } 

  return <TenantSideBar/>
};

export default SideBar;
