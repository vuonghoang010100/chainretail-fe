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
import ContractForm from "./ContractForm";
import { ContractService } from "@/apis/ContractService";

// current page path
const path = ROUTE.TENANT_APP.CONTRACT.path;

const breadcrumbItems = [
  {
    title: (
      <Link to="/">
        <HomeOutlined />
      </Link>
    ),
  },
  {
    title: <Link to={`${path}`}>Hợp đồng</Link>,
  },
  {
    title: "Thêm mới",
  },
];

const NewContract = () => {
  const navigate = useNavigate();

  // -------------------- Create New Store --------------------
  const handleCreate = async (data) => {
    await ContractService.postContract(data);
    navigate(path);
    return true;
  };

  return (
    <PageContent>
      <PageHeader title="Thêm mới hợp đồng" breadcrumbItems={breadcrumbItems} />
      <ContentBox>
        <Title marginBot>Thông tin hợp đồng</Title>
        <ContractForm useForCreate onFinish={handleCreate} />
      </ContentBox>
    </PageContent>
  );
};

export default NewContract;
