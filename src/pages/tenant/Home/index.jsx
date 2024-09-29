import React from "react";
import { HomeOutlined } from "@ant-design/icons";
import { Link } from "react-router-dom";
import { ContentBox, PageContent, PageHeader } from "@/components/layout/PageContent";
import { Title } from "@/components/common/Title";
import { ROUTE } from "@/constants/AppConstant";


const breadcrumbItems = [
  {
    title: (
      <Link to="/">
        <HomeOutlined />
      </Link>
    ),
  },
  {
    title: "Home",
  },
];

const APPROUTE = ROUTE.TENANT_APP;

const Home = () => {
  return (
    <PageContent>
      <PageHeader breadcrumbItems={breadcrumbItems}></PageHeader>

      <ContentBox>
        <Title>Chào mừng đến với hệ thống quản lý bán hàng</Title>
        <br/>
        <br/>

        <Link to={APPROUTE.DASHBOARD.path}>Dashboard</Link>
        <br/>
        <br/>
        <Link to={APPROUTE.PRODUCT.path}>Quản lý sản phẩm</Link>
        <br/>
        <Link to={APPROUTE.CATEGORY.path}>Quản lý nhóm sản phẩm</Link>
        <br/>
        <br/>
        <Link to={APPROUTE.ORDER.path}>Quản lý đơn bán hàng</Link>
        <br/>
        <Link to={APPROUTE.INVOICE.path}>Quản lý hóa đơn bán hàng</Link>
        <br/>
        <Link to={APPROUTE.POS.path}>Điểm bán hàng</Link>
        <br/>
        <br/>
        <Link to={APPROUTE.CUSTOMER.path}>Quản lý khách hàng</Link>
        <br/>
        <Link to={APPROUTE.VENDOR.path}>Quản lý nhà cung cấp</Link>
        <br/>
        <Link to={APPROUTE.DASHBOARD.path}>Quản lý hợp đồng</Link>

      </ContentBox>
    </PageContent>
  );
};

export default Home;
