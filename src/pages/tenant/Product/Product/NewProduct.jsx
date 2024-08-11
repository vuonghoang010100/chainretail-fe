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
import { ProductService } from "@/apis/ProductService";
import ProductForm from "./ProductForm";

// current page path
const path = ROUTE.TENANT_APP.PRODUCT.path;

const breadcrumbItems = [
  {
    title: (
      <Link to="/">
        <HomeOutlined />
      </Link>
    ),
  },
  {
    title: <Link to={`${path}`}>Sản phẩm</Link>,
  },
  {
    title: "Thêm mới",
  },
];

const NewProduct = () => {
  const navigate = useNavigate();

  // -------------------- Create New Store --------------------
  const handleCreate = async (data) => {
    await ProductService.postProduct(data);
    navigate(path);
    return true;
  };

  return (
    <PageContent>
      <PageHeader breadcrumbItems={breadcrumbItems} />
      <ContentBox>
        <Title marginBot>Thông tin sản phẩm</Title>
        <ProductForm useForCreate onFinish={handleCreate} />
      </ContentBox>
    </PageContent>
  );
}

export default NewProduct;