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
import { StoreService } from "@/apis/StoreService";
import { deleteRecord } from "./Order";
import { SaleService } from "@/apis/SaleService";

// current page path
const path = ROUTE.TENANT_APP.ORDER.path;

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
    title: <Link to={`${path}`}>Đơn đặt hàng</Link>,
  },
  {
    title: "Xem",
  },
];

const { Text } = Typography;

const ViewOrder = () => {
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
        const record = await SaleService.getOrderById(id);
        console.log(record);

        // on get cuccessfully
        if (!isMounted) {
          setCurrentRecord(record);
          setLoading(false);
        }
      } catch (error) {
        message.error("Không thể tải dữ liệu đơn đặt hàng!");
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
      label: "Mã đơn đặt hàng",
      children: <Text strong>{currentRecord?.id}</Text>,
    },
    {
      key: useId(),
      label: "Mã hóa đơn",
      children: currentRecord?.invoice?.id,
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
      label: "Khách hàng",
      children: (
        <Link
          to={`${ROUTE.TENANT_APP.CUSTOMER.path}/${currentRecord?.customer?.id}`}
          target="_blank"
        >
          {currentRecord?.customer?.fullName}
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
      label: "Khuyến mãi",
      children: currentRecord?.usePromotes?.map((ele, index) => (
        <div key={index}>
          <Link to={ROUTE.TENANT_APP.PROMOTE.path + "/" + ele?.promote.id} target="_blank">
            {ele?.promote.name}
          </Link>
          <br />
        </div>
      )),
    },

    {
      key: useId(),
      label: "Trạng thái",
      children: currentRecord?.status,
    },
    {
      key: useId(),
      label: "Trạng thái thanh toans",
      children: currentRecord?.invoice?.paymentStatus,
    },

  ];

  const handleEdit = () => {
    navigate(`${path}/${id}/edit`);
  };

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
      title: "Số lượng mua",
      key: "quantity",
      dataIndex: "quantity",
    },
    {
      title: "Giá mua",
      key: "purchasePrice",
      render: (_, record) => (
        `${record?.price}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",") +
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
        title="Xem thông tin đơn đặt hàng"
        breadcrumbItems={breadcrumbItems}
      >
        <Space>
          <Button type="primary" onClick={handleEdit}>
            Cập nhật
          </Button>
          
          <Button onClick={() => navigate(path)}>Đóng</Button>
        </Space>
      </PageHeader>
      <Card title="Thông tin đơn đặt hàng" bordered={false} loading={loading}>
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
        title="Chi tiết đơn đặt hàng"
        bordered={false} loading={loading}
      >
        <Table
          dataSource={currentRecord?.details}
          columns={columns}
          pagination={false}
          summary={() => (
            <>
              <Table.Summary.Row>
                <Table.Summary.Cell index={0}></Table.Summary.Cell>
                <Table.Summary.Cell index={1}></Table.Summary.Cell>
                <Table.Summary.Cell index={2}>Tạm tính</Table.Summary.Cell>
                <Table.Summary.Cell index={3}>{`${currentRecord?.subTotal}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",") + " VND"}</Table.Summary.Cell>
              </Table.Summary.Row>

              <Table.Summary.Row>
                <Table.Summary.Cell index={0}></Table.Summary.Cell>
                <Table.Summary.Cell index={1}></Table.Summary.Cell>
                <Table.Summary.Cell index={2}>Khuyến mãi</Table.Summary.Cell>
                <Table.Summary.Cell index={3}>{currentRecord?.discount ? `${currentRecord?.discount}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",") + " VND" : "0 VND"}</Table.Summary.Cell>
              </Table.Summary.Row>

              <Table.Summary.Row>
                <Table.Summary.Cell index={0}></Table.Summary.Cell>
                <Table.Summary.Cell index={1}></Table.Summary.Cell>
                <Table.Summary.Cell index={2}>Thuế</Table.Summary.Cell>
                <Table.Summary.Cell index={3}>{`${currentRecord?.tax}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",") + " VND"}</Table.Summary.Cell>
              </Table.Summary.Row>

              <Table.Summary.Row>
                <Table.Summary.Cell index={0}></Table.Summary.Cell>
                <Table.Summary.Cell index={1}></Table.Summary.Cell>
                <Table.Summary.Cell index={2}>Tổng số tiền</Table.Summary.Cell>
                <Table.Summary.Cell index={3}>{`${currentRecord?.total}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",") + " VND"}</Table.Summary.Cell>
              </Table.Summary.Row>
            </>
          )}
        />
      </Card>
    </PageContent>
  );
};

export default ViewOrder;
