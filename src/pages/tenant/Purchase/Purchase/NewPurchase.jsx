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
import PurchaseForm from "./PurchaseForm";
import { PurchaseService } from "@/apis/PurchaseService";

// current page path
const path = ROUTE.TENANT_APP.PURCHASE.path;

const breadcrumbItems = [
  {
    title: (
      <Link to="/">
        <HomeOutlined />
      </Link>
    ),
  },
  {
    title: <Link to={`${path}`}>Đơn nhập hàng</Link>,
  },
  {
    title: "Thêm mới",
  },
];

const NewPurchase = () => {
  const navigate = useNavigate();

  // -------------------- Create New Store --------------------
  const handleCreate = async (data) => {

    await PurchaseService.postPurchase(data);
    navigate(path);
    return true;
  };

  return (
    <PageContent>
      <PageHeader 
        title="Thêm mới đơn nhập hàng"
        breadcrumbItems={breadcrumbItems} 
      />
      <ContentBox>
        <Title marginBot>Thông tin đơn nhập hàng</Title>
        <PurchaseForm useForCreate onFinish={handleCreate} />
      </ContentBox>
    </PageContent>
  );
};

export default NewPurchase;
