import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  HomeOutlined,
  TeamOutlined,
} from "@ant-design/icons";
import { Menu, Layout } from "antd";
import styles from "./SideBar.module.css";
import { ROUTE } from "@/constants/AppConstant";


// Helper function
function getMenuItem(label, key, icon, children) {
  return {
    key,
    icon,
    children,
    label,
    //type,
  };
}

// ----- ADMIN APP -----
// define menu items
const menuItems = [
  getMenuItem("Home", "/", <HomeOutlined />),
  getMenuItem("Tenant", ROUTE.ADMIN_APP.TENANT.path, <TeamOutlined />),
];

const AdminSideBar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [selectedKey, setSelectedKey] = useState(["/"]);

  // triger open menu use path
  useEffect(() => {
    const currentPage = "/".concat(location.pathname.split("/")[1]);
    // Only setKey when reload page
    if (selectedKey.indexOf(currentPage) < 0) {
      setSelectedKey([currentPage]);
    }
  }, [location.pathname, selectedKey]);

  return (
    <Layout.Sider theme="light" className={styles.sider}>
      <Menu
        style={{ height: "100%" }}
        onClick={(item) => {
          navigate(item.key); // Route
        }}
        selectedKeys={selectedKey}
        mode="inline"
        items={menuItems}
      />
    </Layout.Sider>
  );
};

export default AdminSideBar;
