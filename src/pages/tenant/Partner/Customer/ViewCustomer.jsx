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
import { deleteRecord } from "./Customer";
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
    title: "Xem",
  },
];

const { Text } = Typography;

const ViewCustomer = () => {
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
        const record = await CustomerService.getCustomerById(id);
        console.log(record);

        // on get cuccessfully
        if (!isMounted) {
          setCurrentRecord(record);
          setLoading(false);
        }
      } catch (error) {
        message.error("Không thể tải dữ liệu khách hàng!");
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
      label: "Tên khách hàng",
      children: <Text strong>{currentRecord?.fullName}</Text>,
    },
    {
      key: useId(),
      label: "Mã khách hàng",
      children: currentRecord?.id,
    },
    {
      key: useId(),
      label: "Ngày sinh",
      children: currentRecord?.dob,
    },
    {
      key: useId(),
      label: "Giới tính",
      children: currentRecord?.gender,
    },
    {
      key: useId(),
      label: "Email",
      children: currentRecord?.email,
    },
    {
      key: useId(),
      label: "Số điện thoại",
      children: currentRecord?.phone,
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
      label: "Điểm thưởng",
      children: currentRecord?.rewardPoint,
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
        title="Xem thông tin khách hàng"
        breadcrumbItems={breadcrumbItems}
      >
        <Space>
          <Button type="primary" onClick={handleEdit}>
            Cập nhật
          </Button>
          <Popconfirm
            title="Xóa khách hàng?"
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
      <Card title="Thông tin khách hàng" bordered={false} loading={loading}>
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

export default ViewCustomer;
