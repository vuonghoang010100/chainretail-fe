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
import CustomerForm from "./CustomerForm";
import { CustomerService } from "@/apis/CustomerService";

// current page path
const path = ROUTE.TENANT_APP.CUSTOMER.path;

const breadcrumbItems = [
  {
    title: (
      <Link to="/">
        <HomeOutlined />
      </Link>
    ),
  },
  {
    title: <Link to={`${path}`}>Khách hàng</Link>,
  },
  {
    title: "Thêm mới",
  },
];

const NewCustomer = () => {
  const navigate = useNavigate();

  // -------------------- Create New Store --------------------
  const handleCreate = async (data) => {
    // preprocess data
    if (!data.rewardPoint) {
      data.rewardPoint = 0
    }

    await CustomerService.postCustomer(data)
    navigate(path);
    return true;
  };

  return (
    <PageContent>
      <PageHeader 
        title="Thêm mới khách hàng"
        breadcrumbItems={breadcrumbItems} 
      />
      <ContentBox>
        <Title marginBot>Thông tin khách hàng</Title>
        <CustomerForm useForCreate onFinish={handleCreate} initRecord={{rewardPoint: 0}}/>
      </ContentBox>
    </PageContent>
  );
};

export default NewCustomer;
