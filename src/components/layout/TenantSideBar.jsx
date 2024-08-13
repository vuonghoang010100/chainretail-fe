import { useCallback, useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  HomeOutlined,
  DashboardOutlined,
  SkinOutlined,
  ShoppingCartOutlined,
  ShoppingOutlined,
  UserOutlined,
  StarOutlined,
  ShopOutlined,
  TeamOutlined,
  LineChartOutlined,
  SettingOutlined,
  MenuUnfoldOutlined,
  MenuFoldOutlined, 
} from "@ant-design/icons";
import { Menu, Layout, Button, Flex } from "antd";
import styles from "./SideBar.module.css";
import { ROUTE, TENANT_GROUP } from "@/constants/AppConstant";


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

// ----- TENANT APP -----
const TENANT_ROUTE = ROUTE.TENANT_APP;
// define menu items
const menuItems = [
  true && getMenuItem("Home", "/", <HomeOutlined />),
  getMenuItem("Dashboard", TENANT_ROUTE.DASHBOARD.path, <DashboardOutlined />),
  getMenuItem("Sản phẩm", TENANT_GROUP.PRODUCT_GROUP, <SkinOutlined />, [
    getMenuItem("Sản phẩm", TENANT_ROUTE.PRODUCT.path),
    getMenuItem("Nhóm sản phẩm", TENANT_ROUTE.CATEGORY.path),
  ]),
  getMenuItem("Bán hàng", TENANT_GROUP.SALE_GROUP, <ShoppingOutlined />, [
    getMenuItem("Đơn đặt hàng", TENANT_ROUTE.ORDER.path),
    getMenuItem("Hóa đơn", TENANT_ROUTE.INVOIVE.path),
    getMenuItem("Bán hàng", TENANT_ROUTE.POS.path),
  ]),
  getMenuItem("Nhập hàng", TENANT_GROUP.PURCHASE_GROUP, <ShoppingCartOutlined />, [
    getMenuItem("Đơn nhập hàng", TENANT_ROUTE.PRUCHASE.path),
    getMenuItem("Hóa đơn nhập hàng", TENANT_ROUTE.BILL.path),
  ]),
  getMenuItem("Đối tác", TENANT_GROUP.PARTNER_GROUP, <UserOutlined />, [
    getMenuItem("Khách hàng", TENANT_ROUTE.CUSTOMER.path),
    getMenuItem("Nhà cung cấp", TENANT_ROUTE.VENDOR.path),
    getMenuItem("Hợp đồng", TENANT_ROUTE.CONTRACT.path),
  ]),
  getMenuItem("Cửa hàng", TENANT_GROUP.STORE_GROUP, <ShopOutlined />, [
    getMenuItem("Cửa hàng", TENANT_ROUTE.STORE.path),
    getMenuItem("Vận chuyển", TENANT_ROUTE.TRANSFER.path),
    getMenuItem("Kiểm kho", TENANT_ROUTE.INVENTORY.path),
  ]),
  getMenuItem("Nhân viên", TENANT_GROUP.STAFF_GROUP, <TeamOutlined />,[
    getMenuItem("Nhân viên", TENANT_ROUTE.STAFF.path),
    getMenuItem("Phân quyền", TENANT_ROUTE.ROLE.path),
  ]),
  getMenuItem("Khuyến mãi", TENANT_ROUTE.PROMOTE.path, <StarOutlined />),
  getMenuItem("Báo cáo", TENANT_ROUTE.REPORT.path, <LineChartOutlined />),
  getMenuItem("Cài đặt", TENANT_ROUTE.SETTING.path, <SettingOutlined />),
];

// define submenu to track to collapse
const rootSubmenuKeys = Object.values(TENANT_GROUP);

const TenantSideBar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);
  const [openKeys, setOpenKeys] = useState([]);
  const [selectedKey, setSelectedKey] = useState(["/"]);

  // collapse all other opened submenu when open new one
  const onOpenChange = useCallback((keys) => {
    const latestOpenKey = keys.find((key) => openKeys.indexOf(key) === -1);
    if (latestOpenKey && rootSubmenuKeys.indexOf(latestOpenKey) === -1) {
      setOpenKeys(keys);
    } else {
      setOpenKeys(latestOpenKey ? [latestOpenKey] : []);
    }
  }, [openKeys]);

  // triger open menu use path
  useEffect(() => {
    const currentPage = "/".concat(location.pathname.split("/")[1]);
    // Only setKey when reload page
    if (selectedKey.indexOf(currentPage) < 0) {
      setSelectedKey([currentPage]);

      const opens = Object.values(TENANT_ROUTE).filter(values => values.path === currentPage).map(values => values.group);
      setOpenKeys(opens);
    }
  }, [location.pathname, selectedKey]);

  return (
    <Layout.Sider theme="light" className={styles.sider} trigger={null} collapsible collapsed={collapsed} onCollapse={(value) => setCollapsed(value)}>
      <Flex 
        vertical
        justify="space-between"
        className={styles.flexAntd}
      >
        <div>
          <Menu
            onClick={(item) => {
              navigate(item.key); // Route
            }}
            selectedKeys={selectedKey}
            mode="inline"
            openKeys={openKeys}
            onOpenChange={onOpenChange}
            items={menuItems}
          />
        </div>
        
        <Button 
          type="text"
          style={{width:"100%"}}
          icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
          onClick={() => setCollapsed(prev => !prev)}
        />
      </Flex>
    </Layout.Sider>
  );
};

export default TenantSideBar;
