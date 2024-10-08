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
  Avatar,
} from "antd";
import { HomeOutlined } from "@ant-design/icons";
import { PageContent, PageHeader } from "@/components/layout/PageContent";
import { ROUTE } from "@/constants/AppConstant";
import { deleteRecord } from "./Transfer";
import { TransferService } from "@/apis/TransferService";

const noImageurl = "https://retail-chain-sale-ms.s3.ap-southeast-2.amazonaws.com/no_image_450.png"

// current page path
const path = ROUTE.TENANT_APP.TRANSFER.path;

const breadcrumbItems = [
  {
    title: (
      <Link to="/">
        <HomeOutlined />
      </Link>
    ),
  },
  {
    title: <Link to={`${path}`}>Đơn vận chuyển</Link>,
  },
  {
    title: "Xem",
  },
];

const { Text } = Typography;

const ViewTransfer = () => {
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
        const record = await TransferService.getTransferById(id);
        console.log(record);

        // on get cuccessfully
        if (!isMounted) {
          setCurrentRecord(record);
          setLoading(false);
        }
      } catch (error) {
        message.error("Không thể tải dữ liệu Đơn vận chuyển giữa các cửa hàng!");
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
      label: "Mã vận chuyển",
      children: <Text strong>{currentRecord?.id}</Text>,
    },
    {
      key: useId(),
      label: "Cửa hàng gửi",
      children: (
        <Link
          to={`${ROUTE.TENANT_APP.STORE.path}/${currentRecord?.fromStore?.id}`}
          target="_blank"
        >
          {currentRecord?.fromStore?.name}
        </Link>
      ),
    },
    {
      key: useId(),
      label: "Cửa hàng nhận",
      children: (
        <Link
          to={`${ROUTE.TENANT_APP.STORE.path}/${currentRecord?.toStore?.id}`}
          target="_blank"
        >
          {currentRecord?.toStore?.name}
        </Link>
      ),
    },
    {
      key: useId(),
      label: "Nhân viên",
      children: (
        <Link
          to={`${ROUTE.TENANT_APP.STAFF.path}/${currentRecord?.employee?.id}`}
          target="_blank"
        >
          {currentRecord?.employee?.fullName}
        </Link>
      ),
    },
    {
      key: useId(),
      label: "Ghi chú",
      children: currentRecord?.note,
    },
    {
      key: useId(),
      label: "Thời gian tạo",
      children: currentRecord?.createTime,
    },
    {
      key: useId(),
      label: "Thời gian cập nhập",
      children: currentRecord?.updateTime,
    },
  ];

  const handleEdit = () => {
    if (currentRecord.status === "Đang vận chuyển") {
      navigate(`${path}/${id}/edit`);
      return;
    }
    if (currentRecord.status === "Hoàn thành")
      message.warning("Đơn vận chuyển đã Hoàn thành, không thể cập nhật!")
    else
      message.warning("Đơn vận chuyển đã Hủy, không thể cập nhật!")
  };

  const handleDelete = async () => {
    await deleteRecord(id);
    navigate(path);
  };

  const columns = [
    {
      title: "Sản phẩm",
      key: "product",
      render: (_, record) => {
        return (
          <>
            <Avatar shape="square" size={48} src={record.product.imageUrl ? record.product.imageUrl : noImageurl} />{" "}
            <Link to={`${ROUTE.TENANT_APP.PRODUCT.path}/${record.product.id}`} target="_blank">{record.product.name}</Link>
          </>
        );
      },
    },
    {
      title: "Vận chuyển từ lô",
      key: "batch",
      render: (_, record) => record.fromBatch?.id
    },
    {
      title: "Vận chuyển đến lô",
      key: "batch",
      render: (_, record) => record.toBatch?.id
    },
    {
      title: "Số lượng sản phẩm",
      key: "realQuantity",
      dataIndex: "quantity",
    },
  ]

  return (
    <PageContent>
      <PageHeader
        title="Xem thông tin đơn vận chuyển"
        breadcrumbItems={breadcrumbItems}
      >
        <Space>
          <Button type="primary" onClick={handleEdit}>
            Cập nhật
          </Button>
          <Popconfirm
            title="Xóa Đơn vận chuyển?"
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
      <Card title="Thông tin đơn vận chuyển giữa các cửa hàng" bordered={false} loading={loading}>
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
      <br/>
      <Card
        title="Chi tiết phiếu kiểm kho"
        bordered={false} loading={loading}
      >
        <Table
          dataSource={currentRecord?.details}
          columns={columns}
          pagination={false}
        />
      </Card>
    </PageContent>
  );
};

export default ViewTransfer;
