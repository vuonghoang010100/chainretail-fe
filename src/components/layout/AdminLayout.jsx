import { Layout, Flex } from "antd";
import styles from "./AdminLayout.module.css";
import Header from "./Header";
import { Outlet } from "react-router-dom";
import Footer from "./Footer";
import SideBar from "./SideBar";

function AdminLayout() {
  return (
    <Layout>
      <Flex vertical className={styles.app}>
        <Header />
        <Layout hasSider>
          <SideBar />
          <Flex vertical className={styles.flexPageContainer}>
            <Layout className={styles.contentLayout}>
              <Outlet />
            </Layout>
            <Footer />
          </Flex>
        </Layout>
      </Flex>
    </Layout>
  );
}

export default AdminLayout;
