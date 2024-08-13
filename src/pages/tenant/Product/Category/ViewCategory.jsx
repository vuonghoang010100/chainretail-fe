import React, { useState, useEffect, useId } from "react";
import { Link, useParams } from "react-router-dom";
import { message, Descriptions, Typography } from "antd";
import { HomeOutlined } from "@ant-design/icons";
import {
  PageContent,
  PageHeader,
  ContentBox,
} from "@/components/layout/PageContent";
import { Title } from "@/components/common/Title";
import { ROUTE } from "@/constants/AppConstant";
import { CategoryService } from "@/apis/CategoryService";

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
    title: "Xem",
  },
];

const { Text } = Typography;

const ViewCategory = () => {
  // -------------------- Page attr --------------------
  const { id } = useParams(); // id
  const [currentRecord, setCurrentRecord] = useState({}); // data

  // -------------------- Fetch data --------------------
  useEffect(() => {
    let isMounted = false; // control mount data only one times

    const fetchData = async () => {
      try {
        const record = await CategoryService.getCategoryById(id);
        console.log(record);

        // on get cuccessfully
        !isMounted && setCurrentRecord(record);
      } catch (error) {
        message.error("Không thể tải dữ liệu nhóm sản phẩm!");
      }
    };

    fetchData();
    return () => {
      isMounted = true;
    };
  }, [id]);

  // -------------------- Description items --------------------
  const infoItems = [
    {
      key: useId(),
      label: "Tên nhóm sản phẩm",
      children: <Text strong>{currentRecord?.name}</Text>,
    },
    {
      key: useId(),
      label: "Mã nhóm sản phẩm",
      children: currentRecord?.id,
    },
    {
      key: useId(),
      label: "Mô tả",
      children: currentRecord?.description,
    },
  ];

  return (
    <PageContent>
      <PageHeader breadcrumbItems={breadcrumbItems} />
      <ContentBox>
        <Title marginBot>Thông tin nhóm sản phẩm</Title>
        <Descriptions
          bordered
          items={infoItems}
          size="small"
          column={1}
          labelStyle={{
            width: "30%",
            minWidth: "max-content",
          }}
        />
      </ContentBox>
    </PageContent>
  );
};

export default ViewCategory;
