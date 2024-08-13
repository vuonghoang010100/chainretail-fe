import React, { useState, useEffect, useId } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import {
  message,
  Descriptions,
  Typography,
  Card,
  Space,
  Button,
  Popconfirm,
} from "antd";
import { HomeOutlined } from "@ant-design/icons";
import { PageContent, PageHeader } from "@/components/layout/PageContent";
import { ROUTE } from "@/constants/AppConstant";
import { StoreService } from "@/apis/StoreService";
import { deleteRecord } from "./Store";

// current page path
const path = ROUTE.TENANT_APP.STORE.path;

const breadcrumbItems = [
  {
    title: (
      <Link to="/">
        <HomeOutlined />
      </Link>
    ),
  },
  {
    title: <Link to={`${path}`}>Cửa hàng</Link>,
  },
  {
    title: "Xem",
  },
];

const { Text } = Typography;

const ViewStore = () => {
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
        const record = await StoreService.getStoreById(id);
        console.log(record);

        // on get cuccessfully
        if (!isMounted) {
          setCurrentRecord(record);
          setLoading(false);
        }
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
      label: "Tên hiển thị",
      children: <Text strong>{currentRecord?.name}</Text>,
    },
    {
      key: useId(),
      label: "Mã cửa hàng",
      children: currentRecord?.id,
    },
    {
      key: useId(),
      label: "Tên cửa hàng",
      children: currentRecord?.fullName,
    },
    {
      key: useId(),
      label: "Số điện thoại",
      children: currentRecord?.phone,
    },
    {
      key: useId(),
      label: "Email",
      children: currentRecord?.email,
    },
    {
      key: useId(),
      label: "Tỉnh/Thành phố",
      children: currentRecord?.province,
    },
    {
      key: useId(),
      label: "Quận/Huyện",
      children: currentRecord?.district,
    },
    {
      key: useId(),
      label: "Địa chỉ",
      children: currentRecord?.address,
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
        title="Xem thông tin cửa hàng"
        breadcrumbItems={breadcrumbItems}
      >
        <Space>
          <Button type="primary" onClick={handleEdit}>
            Cập nhật
          </Button>
          <Popconfirm
            title="Xóa cửa hàng?"
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
      <Card title="Thông tin cửa hàng" bordered={false} loading={loading}>
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
      </Card>
    </PageContent>
  );
};

export default ViewStore;
