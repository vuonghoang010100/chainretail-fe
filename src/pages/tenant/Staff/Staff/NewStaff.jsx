import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { HomeOutlined } from "@ant-design/icons";
import {
  PageContent,
  PageHeader,
  ContentBox,
} from "@/components/layout/PageContent";
import { Title } from "@/components/common/Title";
import StaffForm from "./StaffForm";
import ShortContent from "@/components/layout/ShortContent";

// current page path
const path = "/staff";

const breadcrumbItems = [
  {
    title: (
      <Link to="/">
        <HomeOutlined />
      </Link>
    ),
  },
  {
    title: <Link to={`${path}`}>Nhân viên</Link>,
  },
  {
    title: "Thêm mới",
  },
];

const NewStaff = () => {
  const navigate = useNavigate();

  // -------------------- Create New Store --------------------
  const createStore = async (storeData) => {
    try {
      // await CustomerAPI.postCustomer(customerData);

      //fake
      await new Promise((resolve) => setTimeout(resolve, 1000));

      navigate(path);
      return true;
    } catch (error) {
      throw error;
    }
  };

  return (
    <PageContent>
    <PageHeader breadcrumbItems={breadcrumbItems} />
    
      <ContentBox>
        <Title marginBot>Thông tin nhân viên</Title>
        <StaffForm useForCreate onFinish={createStore} />
      </ContentBox>

    
      
    </PageContent>
  );
};

export default NewStaff ;
