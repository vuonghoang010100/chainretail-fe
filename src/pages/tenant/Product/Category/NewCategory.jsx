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
import { CategoryService } from "@/apis/CategoryService";
import CategoryForm from "./CategoryForm";

// current page path
const path = ROUTE.TENANT_APP.CATEGORY.path;

const breadcrumbItems = [
  {
    title: (
      <Link to="/">
        <HomeOutlined />
      </Link>
    ),
  },
  {
    title: <Link to={`${path}`}>Nhóm sản phẩm</Link>,
  },
  {
    title: "Thêm mới",
  },
];

const NewCategory = () => {
  const navigate = useNavigate();

  // -------------------- Create New Store --------------------
  const handleCreate = async (data) => {
    await CategoryService.postCategory(data);
    navigate(path);
    return true;
  };

  return (
    <PageContent>
      <PageHeader breadcrumbItems={breadcrumbItems} />
      <ContentBox>
        <Title marginBot>Thông tin nhóm sản phẩm</Title>
        <CategoryForm useForCreate onFinish={handleCreate} />
      </ContentBox>
    </PageContent>
  );
}

export default NewCategory;
