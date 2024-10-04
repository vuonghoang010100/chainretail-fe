import React, { useState, useEffect, useId } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { message, Descriptions, Typography, Space, Button, Popconfirm, Card, Avatar, Flex } from "antd";
import { HomeOutlined } from "@ant-design/icons";
import {
  PageContent,
  PageHeader,
} from "@/components/layout/PageContent";
// import { Title } from "@/components/common/Title";
import { ROUTE } from "@/constants/AppConstant";
import { ProductService } from "@/apis/ProductService";
import { deleteRecord } from "./Product";

const noImageurl =
  "https://retail-chain-sale-ms.s3.ap-southeast-2.amazonaws.com/no_image_450.png";

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
    title: "Xem",
  },
];

const { Text } = Typography;

const ViewProduct = () => {
  const navigate = useNavigate();

  // -------------------- Page attr --------------------
  const { id } = useParams(); // id
  const [loading, setLoading] = useState(true);
  const [currentRecord, setCurrentRecord] = useState({}); // data

  // -------------------- Fetch data --------------------
  useEffect(() => {
    let isMounted = false; // control mount data only one times

    const fetchData = async () => {
      try {
        const record = await ProductService.getProductById(id);
        console.log(record);

        // on get cuccessfully
        if (!isMounted) {
          setCurrentRecord(record);
          setLoading(false);
        }
      } catch (error) {
        message.error("Không thể tải dữ liệu nhân viên!");
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
      label: "Tên sản phẩm",
      children: <Text strong>{currentRecord?.name}</Text>,
    },
    {
      key: useId(),
      label: "Mã sản phẩm",
      children: currentRecord?.id,
    },
    {
      key: useId(),
      label: "Mã vạch",
      children: currentRecord?.sku,
    },
    {
      key: useId(),
      label: "Thương hiệu",
      children: currentRecord?.brand,
    },
    {
      key: useId(),
      label: "Nhóm sản phẩm",
      children: (
        <Link
          to={ROUTE.TENANT_APP.CATEGORY.path + "/" + currentRecord?.category?.id}
          target="_blank"
        >
          {currentRecord?.category?.name}
        </Link>
      ),
    },
    {
      key: useId(),
      label: "Đơn vị",
      children: currentRecord?.unit,
    },
    {
      key: useId(),
      label: "Giá bán",
      children:
        `${currentRecord?.price}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",") +
        " VND",
    },
    {
      key: useId(),
      label: "Mô tả",
      children: currentRecord?.description,
    },
    {
      key: useId(),
      label: "Trạng thái",
      children: currentRecord?.status,
    },
    {
      key: useId(),
      label: "Ghi chú",
      children: currentRecord?.note,
    },
  ];

  const handleEdit = () => {
    navigate(`${path}/${id}/edit`);
  };

  const handleDelete = async () => {
    await deleteRecord(id);
    navigate(path);
  };

  return (
    <PageContent>
      <PageHeader
        title="Xem thông tin sản phẩm"
        breadcrumbItems={breadcrumbItems}
      >
        <Space>
          <Button type="primary" onClick={handleEdit}>
            Cập nhật
          </Button>

          <Popconfirm
            title="Xóa sản phẩm?"
            okText="Xóa"
            cancelText="Đóng"
            placement="bottomRight"
            onConfirm={handleDelete}
          >
            <Button type="primary" danger>
              Xóa
            </Button>
          </Popconfirm>

          <Button onClick={() => navigate(path)}>Đóng</Button>
        </Space>
      </PageHeader>

      <Card title="Thông tin sản phẩm" bordered={false} loading={loading}>
        <Flex gap="large" wrap>
          <Avatar
            shape="square"
            size={300}
            src={currentRecord?.imageUrl || noImageurl}
          />

          <Descriptions
            bordered
            items={infoItems}
            size="small"
            column={1}
            labelStyle={{
              width: "30%",
              minWidth: "max-content",
            }}
            style={{
              flex: "1 0 400px",
            }}
          />
        </Flex>
      </Card>
    </PageContent>
  );
};

export default ViewProduct;
