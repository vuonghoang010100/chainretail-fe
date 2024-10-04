import React, { useState, useEffect, useId } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import {
  message,
  Descriptions,
  Typography,
  Card,
  Space,
  Button,
} from "antd";
import { HomeOutlined } from "@ant-design/icons";
import { PageContent, PageHeader } from "@/components/layout/PageContent";
import { ROUTE } from "@/constants/AppConstant";
import { TenantService } from "@/apis/TenantService";

// current page path
const path = ROUTE.ADMIN_APP.TENANT.path;

const breadcrumbItems = [
  {
    title: (
      <Link to="/">
        <HomeOutlined />
      </Link>
    ),
  },
  {
    title: <Link to={`${path}`}>Tenant</Link>,
  },
  {
    title: "Xem",
  },
];

const { Text } = Typography;

const ViewTenant = () => {
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
        const record = await TenantService.getTenantById(id);
        console.log(record);

        // on get cuccessfully
        if (!isMounted) {
          setCurrentRecord(record);
          setLoading(false);
        }
      } catch (error) {
        message.error("Không thể tải dữ liệu!");
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
      label: "Tên miền",
      children: <Text strong>{currentRecord?.name}</Text>,
    },
    {
      key: useId(),
      label: "Mã tenant",
      children: currentRecord?.id,
    },
    {
      key: useId(),
      label: "Tên công ty",
      children: currentRecord?.companyName,
    },
    {
      key: useId(),
      label: "Giấy phép kinh doanh",
      children: currentRecord?.businessLicenseUrl,
    },
    {
      key: useId(),
      label: "Trạng thái kích hoạt",
      children: currentRecord?.initStatus ? "Chưa kích hoạt" : "Đã kích hoạt",
    },
    {
      key: useId(),
      label: "Trạng thái",
      children: currentRecord?.active ? "Hoạt động" : "Dừng hoạt động",
    },
    {
      key: useId(),
      label: "Tên người sở hữu",
      children: currentRecord?.user?.fullName,
    },
    {
      key: useId(),
      label: "Email liên hệ",
      children: currentRecord?.user?.email,
    },
  ];

  const handleEdit = async () => {
    if (currentRecord?.initStatus) {
      message.info("Tenant đã được kích hoạt!")
      return;
    }
    message.info("Đang gửi yêu cầu kích hoạt tenant!");
    try {
      await TenantService.active(id);
      message.info("Đã kích hoạt Tenant thành công!")
    } catch (error) {
      message.error("Không thể kích hoạt Tenant!");
    }

  };

  return (
    <PageContent>
      <PageHeader
        title="Xem thông tin Tenant"
        breadcrumbItems={breadcrumbItems}
      >
        <Space>
          <Button type="primary" onClick={handleEdit}>
            Kích hoạt
          </Button>

          <Button onClick={() => navigate(path)}>Đóng</Button>
        </Space>
      </PageHeader>
      <Card title="Thông tin Tenant" bordered={false} loading={loading}>
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

export default ViewTenant;
