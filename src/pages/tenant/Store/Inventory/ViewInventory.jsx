import React, { useState, useEffect, useId } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import {
  message,
  Descriptions,
  Typography,
  Card,
  Space,
  Button,
  Table,
  Avatar,
} from "antd";
import { HomeOutlined } from "@ant-design/icons";
import { PageContent, PageHeader } from "@/components/layout/PageContent";
import { ROUTE } from "@/constants/AppConstant";
import { InventoryService } from "@/apis/InventoryService";

const noImageurl = "https://retail-chain-sale-ms.s3.ap-southeast-2.amazonaws.com/no_image_450.png"

// current page path
const path = ROUTE.TENANT_APP.INVENTORY.path;

const breadcrumbItems = [
  {
    title: (
      <Link to="/">
        <HomeOutlined />
      </Link>
    ),
  },
  {
    title: <Link to={`${path}`}>Đơn kiểm kho</Link>,
  },
  {
    title: "Xem",
  },
];

const { Text } = Typography;

const ViewInventory = () => {
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
        const record = await InventoryService.getInventoryById(id);
        console.log(record);

        // on get cuccessfully
        if (!isMounted) {
          setCurrentRecord(record);
          setLoading(false);
        }
      } catch (error) {
        message.error("Không thể tải dữ liệu đơn kiểm kho!");
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
      label: "Thời gian tạo",
      children: currentRecord?.createTime,
    },
    {
      key: useId(),
      label: "Thời gian cập nhập",
      children: currentRecord?.updateTime,
    },
  ];

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
      title: "Lô",
      key: "batch",
      render: (_, record) => record.batch?.id
    },
    {
      title: "Số lượng hệ thống",
      key: "dbQuantity",
      dataIndex: "dbQuantity",
    },
    {
      title: "Số lượng thực tế",
      key: "realQuantity",
      dataIndex: "realQuantity",
    },
    {
      title: "Sai lệch",
      key: "differenceQuantity",
      dataIndex: "differenceQuantity",
    },
  ]

  return (
    <PageContent>
      <PageHeader
        title="Xem thông tin đơn kiểm kho"
        breadcrumbItems={breadcrumbItems}
      >
        <Space>
          <Button onClick={() => navigate(path)}>Đóng</Button>
        </Space>
      </PageHeader>
      <Card title="Thông tin đơn kiểm kho" bordered={false} loading={loading}>
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
          // summary={() => (
          //   <Table.Summary.Row>
          //     <Table.Summary.Cell index={0}></Table.Summary.Cell>
          //     <Table.Summary.Cell index={1}></Table.Summary.Cell>
          //     <Table.Summary.Cell index={2}></Table.Summary.Cell>
          //     <Table.Summary.Cell index={3}>Tổng số tiền</Table.Summary.Cell>
          //     <Table.Summary.Cell index={4}>{`${currentRecord?.total}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",") + " VND"}</Table.Summary.Cell>
          //   </Table.Summary.Row>
          // )}
        />
      </Card>
    </PageContent>
  );
};

export default ViewInventory;
