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
import BillForm from "./BillForm";
import { BillService } from "@/apis/BillService";

// current page path
const path = ROUTE.TENANT_APP.BILL.path;

const breadcrumbItems = [
  {
    title: (
      <Link to="/">
        <HomeOutlined />
      </Link>
    ),
  },
  {
    title: <Link to={`${path}`}>Hóa đơn nhập hàng</Link>,
  },
  {
    title: "Thêm mới",
  },
];

const NewBill = () => {
  const navigate = useNavigate();

  // -------------------- Create New Store --------------------
  const handleCreate = async (data) => {
    await BillService.postBill(data);
    navigate(path);
    return true;
  };

  return (
    <PageContent>
      <PageHeader 
        title="Thêm mới Hoá đơn nhập hàng"
        breadcrumbItems={breadcrumbItems} 
      />
      <ContentBox>
        <Title marginBot>Thông tin Hoá đơn nhập hàng</Title>
        <BillForm useForCreate onFinish={handleCreate} />
      </ContentBox>
    </PageContent>
  );
};

export default NewBill;
