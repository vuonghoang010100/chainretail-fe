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
  Avatar,
  Table,
} from "antd";
import { HomeOutlined } from "@ant-design/icons";
import { PageContent, PageHeader } from "@/components/layout/PageContent";
import { ROUTE } from "@/constants/AppConstant";
import { deleteRecord } from "./Purchase";
import { PurchaseService } from "@/apis/PurchaseService";

// current page path
const path = ROUTE.TENANT_APP.PURCHASE.path;

const noImageurl = "https://retail-chain-sale-ms.s3.ap-southeast-2.amazonaws.com/no_image_450.png"

const breadcrumbItems = [
  {
    title: (
      <Link to="/">
        <HomeOutlined />
      </Link>
    ),
  },
  {
    title: <Link to={`${path}`}>Đơn nhập hàng</Link>,
  },
  {
    title: "Xem",
  },
];

const { Text } = Typography;

const ViewPurchase = () => {
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
        const record = await PurchaseService.getPurchaseById(id);
        console.log(record);

        // on get cuccessfully
        if (!isMounted) {
          setCurrentRecord(record);
          setLoading(false);
        }
      } catch (error) {
        message.error("Không thể tải dữ liệu đơn nhập hàng!");
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
      label: "Mã đơn nhập hàng",
      children: <Text strong>{currentRecord?.id}</Text>,
    },
    {
      key: useId(),
      label: "Cửa hàng",
      children: (
        <Link
          to={`${ROUTE.TENANT_APP.STORE.path}/${currentRecord?.store?.id}`}
          target="_blank"
        >
          {currentRecord?.store?.name}
        </Link>
      ),
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
      label: "Hợp đồng",
      children: (
        <Link
          to={`${ROUTE.TENANT_APP.CONTRACT.path}/${currentRecord?.contract?.id}`}
          target="_blank"
        >
          {currentRecord?.contract?.id && "Hợp đồng"} {currentRecord?.contract?.id}
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
      label: "Tổng số tiền",
      children:
        `${currentRecord?.total}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",") +
        " VND",
    },
    {
      key: useId(),
      label: "Trạng thái",
      children: currentRecord?.status,
    },
    {
      key: useId(),
      label: "Trạng thái nhận hàng",
      children: currentRecord?.receiveStatus,
    },
    {
      key: useId(),
      label: "Ngày nhận hàng",
      children: currentRecord?.receivedDate,
    },
    {
      key: useId(),
      label: "Trạng thái thanh toán",
      children: currentRecord?.paymentStatus,
    },
    {
      key: useId(),
      label: "Hóa đơn",
      children: (
        <Link
          to={`${ROUTE.TENANT_APP.BILL.path}/${currentRecord?.bill?.id}`}
          target="_blank"
        >
          {currentRecord?.bill?.id && "Hóa đơn"} {currentRecord?.bill?.id}
        </Link>
      ),
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
    {
      key: useId(),
      label: "Ghi chú",
      children: currentRecord?.note,
    },
  ];

  const handleEdit = () => {
    navigate(`${path}/${id}/edit`);
  };

  const handleReceive = () => {
    navigate(`${path}/${id}/receive`);
  }

  const handleDelete = async () => {
    await deleteRecord(id);
    navigate(path);
  };

  // ------------- Table columns
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
      title: "Số lượng đặt mua",
      key: "purchaseAmount",
      dataIndex: "purchaseAmount",
    },
    {
      title: "Số lượng nhận",
      key: "receivedAmount",
      dataIndex: "receivedAmount",
    },
    {
      title: "Giá mua",
      key: "purchasePrice",
      render: (_, record) => (
        `${record?.purchasePrice}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",") +
        " VND"
      )
    },
    {
      title: "Thành tiền",
      key: "subTotal",
      render: (_, record) => (
        `${record?.subTotal}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",") +
        " VND"
      )
    },
  ]

  return (
    <PageContent>
      <PageHeader
        title="Xem thông tin đơn nhập hàng"
        breadcrumbItems={breadcrumbItems}
      >
        <Space>
          {currentRecord.status === "Chờ nhận hàng" && (
            <Button type="primary" onClick={handleReceive} >
              Nhận hàng
            </Button>
          )}

          {currentRecord.status != "Hoàn thành" && (
            <Button type="primary" onClick={handleEdit}>
              Cập nhật
            </Button>
          )}

          <Popconfirm
            title="Xóa đơn nhập hàng?"
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
      <Card title="Thông tin đơn nhập hàng" bordered={false} loading={loading}>
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
        title="Chi tiết đơn nhập hàng"
        bordered={false} loading={loading}
      >
        <Table
          dataSource={currentRecord?.details}
          columns={columns}
          pagination={false}
          summary={() => (
            <Table.Summary.Row>
              <Table.Summary.Cell index={0}></Table.Summary.Cell>
              <Table.Summary.Cell index={1}></Table.Summary.Cell>
              <Table.Summary.Cell index={2}></Table.Summary.Cell>
              <Table.Summary.Cell index={3}>Tổng số tiền</Table.Summary.Cell>
              <Table.Summary.Cell index={4}>{`${currentRecord?.total}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",") + " VND"}</Table.Summary.Cell>
            </Table.Summary.Row>
          )}
        />
      </Card>
    </PageContent>
  );
};

export default ViewPurchase;
