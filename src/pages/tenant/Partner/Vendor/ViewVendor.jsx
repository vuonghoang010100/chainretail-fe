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
  Table,
} from "antd";
import { HomeOutlined, PaperClipOutlined } from "@ant-design/icons";
import { PageContent, PageHeader } from "@/components/layout/PageContent";
import { ROUTE } from "@/constants/AppConstant";
import { deleteRecord } from "./Vendor";
import { VendorService } from "@/apis/VendorService";

// current page path
const path = ROUTE.TENANT_APP.VENDOR.path;

const breadcrumbItems = [
  {
    title: (
      <Link to="/">
        <HomeOutlined />
      </Link>
    ),
  },
  {
    title: <Link to={`${path}`}>Nhà cung cấp</Link>,
  },
  {
    title: "Xem",
  },
];

const { Text } = Typography;

const tabList = [
  {
    key: 1,
    tab: "Thông tin nhà cung cấp",
  },
  {
    key: 2,
    tab: "Danh sách hợp đồng",
  },
];

const ViewVendor = () => {
  const navigate = useNavigate();
  // -------------------- Page attr --------------------
  const { id } = useParams(); // id
  const [loading, setLoading] = useState(true);
  const [currentRecord, setCurrentRecord] = useState({}); // data

  const [activeTabKey, setActiveTabKey] = useState(1);

  const onTabChange = (key) => {
    setActiveTabKey(key);
  };

  // -------------------- Fetch data --------------------
  useEffect(() => {
    let isMounted = false; // control mount data only one times

    const fetchData = async () => {
      try {
        const record = await VendorService.getVendorById(id);
        console.log(record);

        // on get cuccessfully
        if (!isMounted) {
          setCurrentRecord(record);
          setLoading(false);
        }
      } catch (error) {
        message.error("Không thể tải dữ liệu nhà cung cấp!");
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
      label: "Tên nhà cung cấp",
      children: <Text strong>{currentRecord?.fullName}</Text>,
    },
    {
      key: useId(),
      label: "Mã nhà cung cấp",
      children: currentRecord?.id,
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

  const colums = [
    {
      title: "Mã hợp đồng",
      key: "id",
      render: (_, record) => {
        return (
          <Link
            to={`${ROUTE.TENANT_APP.CONTRACT.path}/${record.id}`}
            target="_blank"
          >
            {record.id}
          </Link>
        );
      },
    },
    {
      title: "Ngày bắt đầu",
      dataIndex: "startDate",
      key: "startDate",
    },
    {
      title: "Ngày kết thúc",
      dataIndex: "endDate",
      key: "endDate",
    },
    {
      title: "Chu kỳ",
      key: "period",
      render: (_, record) => {
        return record?.period + " Ngày";
      },
    },
    {
      title: "Nhập gần nhất",
      dataIndex: "latestPurchaseDate",
      key: "latestPurchaseDate",
    },
    {
      title: "Hạn nhập hàng kế tiếp",
      dataIndex: "nextPurchaseDate",
      key: "nextPurchaseDate",
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
    },
    {
      title: "Tệp tin",
      key: "pdfUrl",
      render: (_, record) => (
        <Link to={`${record?.pdfUrl}`} target="_blank">
          {record?.pdfUrl && (
            <>
              <PaperClipOutlined /> Hợp đồng
            </>
          )}
        </Link>
      ),
    },
  ];

  const contentList = {
    1: (
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
    ),
    2: (
      <Table
        dataSource={currentRecord.contracts}
        columns={colums}
        pagination={false}
      />
    ),
  };

  return (
    <PageContent>
      <PageHeader
        title="Xem thông tin nhà cung cấp"
        breadcrumbItems={breadcrumbItems}
      >
        <Space>
          <Button type="primary" onClick={handleEdit}>
            Cập nhật
          </Button>
          <Popconfirm
            title="Xóa nhà cung cấp?"
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
      <Card
        // title="Thông tin nhà cung cấp"
        tabList={tabList}
        activeTabKey={activeTabKey}
        onTabChange={onTabChange}
        bordered={false}
        loading={loading}
      >
        {contentList[activeTabKey]}
      </Card>
      {/* TODO: contract list */}
    </PageContent>
  );
};

export default ViewVendor;
