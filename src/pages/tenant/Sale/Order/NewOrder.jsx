import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { HomeOutlined } from "@ant-design/icons";
import {
  PageContent,
  PageHeader,
  ContentBox,
} from "@/components/layout/PageContent";
import { Title } from "@/components/common/Title";
import { ROUTE } from "@/constants/AppConstant";
import OrderForm from "./OrderForm";
import { StoreService } from "@/apis/StoreService";

// current page path
const path = ROUTE.TENANT_APP.ORDER.path;

const breadcrumbItems = [
  {
    title: (
      <Link to="/">
        <HomeOutlined />
      </Link>
    ),
  },
  {
    title: <Link to={`${path}`}>Đơn đặt hàng</Link>,
  },
  {
    title: "Thêm mới",
  },
];

const NewOrder = () => {
  const navigate = useNavigate();

  // -------------------- Create New Store --------------------
  const handleCreate = async (data) => {
    await StoreService.postStore(data);
    navigate(path);
    return true;
  };

  return (
    <PageContent>
      <PageHeader 
        title="Thêm mới đơn đặt hàng"
        breadcrumbItems={breadcrumbItems} 
      />
      <ContentBox>
        <Title marginBot>Thông tin đơn đặt hàng</Title>
        <OrderForm useForCreate onFinish={handleCreate} />
      </ContentBox>
    </PageContent>
  );
};

export default NewOrder;
