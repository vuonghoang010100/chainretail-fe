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
import { HomeOutlined } from "@ant-design/icons";
import { PageContent, PageHeader } from "@/components/layout/PageContent";
import { ROUTE } from "@/constants/AppConstant";
import { deleteRecord } from "./Bill";
import { BillService } from "@/apis/BillService";

// current page path
const path = ROUTE.TENANT_APP.BILL.path;

const breadcrumbItems = [
  {
    title: (
      <Link to="/">
        <HomeOutlined />
      </Link>
    ),
  },
  {
    title: <Link to={`${path}`}>Hóa đơn nhập hàng</Link>,
  },
  {
    title: "Xem",
  },
];

const { Text } = Typography;

const ViewBill = () => {
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
        const record = await BillService.getBillById(id);
        console.log(record);

        // on get cuccessfully
        if (!isMounted) {
          setCurrentRecord(record);
          setLoading(false);
        }
      } catch (error) {
        message.error("Không thể tải dữ liệu Hóa đơn nhập hàng!");
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
      label: "Mã hóa đơn",
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
      label: "Đơn nhập hàng",
      children: currentRecord?.purchases?.map((ele, index) => (
        <div key={index}>
          <Link to={ROUTE.TENANT_APP.PURCHASE.path + "/" + ele.id} target="_blank">
            {`Đơn nhập hàng ${ele.id}`}
          </Link>
          <br />
        </div>
      )),
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
      label: "Trạng thái thanh toán",
      children: currentRecord?.paymentStatus,
    },
    {
      key: useId(),
      label: "Ghi chú",
      children: currentRecord?.note,
    },
  ];

  const handleEdit = () => {
    if (currentRecord.paymentStatus === "Đã thanh toán") {
      message.info("Hóa đơn đã thanh toán!")
      return;
    }
    navigate(`${path}/${id}/edit`);
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
          <Link to={ROUTE.TENANT_APP.PURCHASE.path + "/" + record.id} target="_blank">
          {`Đơn nhập hàng ${record.id}`}
        </Link>
        );
      },
    },
    {
      title: "Số tiền",
      key: "total",
      render: (_, record) => (
        `${record?.total}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",") +
        " VND"
      )
    },
  ]

  return (
    <PageContent>
      <PageHeader
        title="Xem thông tin Hóa đơn nhập hàng"
        breadcrumbItems={breadcrumbItems}
      >
        <Space>
          <Button type="primary" onClick={handleEdit}>
            Cập nhật
          </Button>
          <Popconfirm
            title="Xóa Hóa đơn nhập hàng?"
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
      <Card title="Thông tin Hóa đơn nhập hàng" bordered={false} loading={loading}>
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
        title="Chi tiết Hóa đơn nhập hàng"
        bordered={false} loading={loading}
      >
        <Table
          dataSource={currentRecord?.purchases}
          columns={columns}
          pagination={false}
          summary={() => (
            <Table.Summary.Row>
              <Table.Summary.Cell index={0}>Tổng số tiền</Table.Summary.Cell>
              <Table.Summary.Cell index={1}>{`${currentRecord?.total}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",") + " VND"}</Table.Summary.Cell>
            </Table.Summary.Row>
          )}
        />
      </Card>
    </PageContent>
  );
};

export default ViewBill;
