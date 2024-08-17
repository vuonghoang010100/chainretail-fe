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
import { HomeOutlined, PaperClipOutlined } from "@ant-design/icons";
import { PageContent, PageHeader } from "@/components/layout/PageContent";
import { ROUTE } from "@/constants/AppConstant";
import { deleteRecord } from "./Contract";
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
    title: "Xem",
  },
];

const { Text } = Typography;

const ViewContract = () => {
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
        const record = await ContractService.getContractById(id);
        console.log(record);

        // on get cuccessfully
        if (!isMounted) {
          setCurrentRecord(record);
          setLoading(false);
        }
      } catch (error) {
        message.error("Không thể tải dữ liệu hợp đồng!");
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
      label: "Mã hợp đồng",
      children: <Text strong>{currentRecord?.id}</Text>,
    },
    {
      key: useId(),
      label: "Nhà cung cấp",
      children: (
        <Link
          to={`${ROUTE.TENANT_APP.VENDOR.path}/${currentRecord?.vendor?.id}`}
          target="_blank"
        >
          {currentRecord?.vendor?.fullName}
        </Link>
      ),
    },
    {
      key: useId(),
      label: "Ngày bắt đầu",
      children: currentRecord?.startDate,
    },
    {
      key: useId(),
      label: "Ngày kết thúc",
      children: currentRecord?.endDate,
    },
    {
      key: useId(),
      label: "Chu kỳ",
      children: currentRecord?.period + " Ngày",
    },
    {
      key: useId(),
      label: "Ngày nhập sản phẩm gần nhất",
      children: currentRecord?.latestPurchaseDate,
    },
    {
      key: useId(),
      label: "Hạn nhập sản phẩm kế tiếp",
      children: currentRecord?.nextPurchaseDate,
    },
    {
      key: useId(),
      label: "Tệp tin hợp đồng",
      children: currentRecord?.pdfUrl ? (
        <Link to={`${currentRecord?.pdfUrl}`} target="_blank">
          <PaperClipOutlined /> Hợp đồng.pdf
        </Link>
      ) : (
        "Không có tài liệu đính kèm"
      ),
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
        title="Xem thông tin hợp đồng"
        breadcrumbItems={breadcrumbItems}
      >
        <Space>
          <Button type="primary" onClick={handleEdit}>
            Cập nhật
          </Button>
          <Popconfirm
            title="Xóa hợp đồng?"
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
      <Card title="Thông tin hợp đồng" bordered={false} loading={loading}>
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

export default ViewContract;
