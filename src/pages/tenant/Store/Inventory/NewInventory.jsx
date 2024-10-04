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
import InventoryForm from "./InventoryForm";
import { InventoryService } from "@/apis/InventoryService";

// current page path
const path = ROUTE.TENANT_APP.INVENTORY.path;

const breadcrumbItems = [
  {
    title: (
      <Link to="/">
        <HomeOutlined />
      </Link>
    ),
  },
  {
    title: <Link to={`${path}`}>Đơn kiểm kho</Link>,
  },
  {
    title: "Thêm mới",
  },
];

const NewInventory = () => {
  const navigate = useNavigate();

  // -------------------- Create New Store --------------------
  const handleCreate = async (data) => {
    await InventoryService.postInventory(data);
    navigate(path);
    return true;
  };

  return (
    <PageContent>
      <PageHeader 
        title="Thêm mới đơn kiểm kho"
        breadcrumbItems={breadcrumbItems} 
      />
      <ContentBox>
        <Title marginBot>Thông tin đơn kiểm kho</Title>
        <InventoryForm useForCreate onFinish={handleCreate} />
      </ContentBox>
    </PageContent>
  );
};

export default NewInventory;
