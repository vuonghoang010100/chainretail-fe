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
import { ROUTE } from "@/constants/AppConstant";
import { StaffSerivce } from "@/apis/StaffService";

// current page path
const path = ROUTE.TENANT_APP.STAFF.path;

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
  const handleCreate = async (data) => {
    await StaffSerivce.postStaff(data);
    navigate(path);
    return true;
  };

  return (
    <PageContent>
      <PageHeader breadcrumbItems={breadcrumbItems} />
      <ContentBox>
        <Title marginBot>Thông tin nhân viên</Title>
        <StaffForm useForCreate onFinish={handleCreate} />
      </ContentBox>
    </PageContent>
  );
};

export default NewStaff;
