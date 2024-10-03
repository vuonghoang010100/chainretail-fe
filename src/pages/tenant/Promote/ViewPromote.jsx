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
import { deleteRecord } from "./Promote";
import { PromoteService } from "@/apis/PromoteService";

// current page path
const path = ROUTE.TENANT_APP.PROMOTE.path;

const breadcrumbItems = [
  {
    title: (
      <Link to="/">
        <HomeOutlined />
      </Link>
    ),
  },
  {
    title: <Link to={`${path}`}>Khuyến mãi</Link>,
  },
  {
    title: "Xem",
  },
];

const { Text } = Typography;

const ViewPromote = () => {
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
        const record = await PromoteService.getPromoteById(id);
        console.log(record);

        // on get cuccessfully
        if (!isMounted) {
          setCurrentRecord(record);
          setLoading(false);
        }
      } catch (error) {
        message.error("Không thể tải dữ liệu khuyến mãi!");
      }
    };

    fetchData();
    return () => {
      isMounted = true;
    };
  }, [id]);

  // -------------------- Description items --------------------
  let infoItems = [
    {
      key: useId(),
      label: "Mã khuyến mãi",
      children: <Text strong>{currentRecord?.name}</Text>,
    },
    {
      key: useId(),
      label: "Mô tả",
      children: currentRecord?.description,
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
      label: "Số lượng",
      children: currentRecord?.quantity,
    },
    {
      key: useId(),
      label: "Trạng thái",
      children: currentRecord?.status,
    },
    {
      key: useId(),
      label: "Loại khuyến mãi",
      children: currentRecord?.type,
    },
    {
      key: useId(),
      label: "% hóa đơn",
      children: (
        <>{currentRecord?.percentage ? currentRecord?.percentage + "%" : ""}</>
      ),
    },
    {
      key: useId(),
      label: "Giá giảm tối đa",
      children: currentRecord?.maxDiscount,
    },
    {
      key: useId(),
      label: "Sản phẩm",
      children: (
        <Link
          to={ROUTE.TENANT_APP.PRODUCT.path + "/" + currentRecord?.product?.id}
          target="_blank"
        >
          {currentRecord?.product?.name}
        </Link>
      ),
    },
    {
      key: useId(),
      label: "Giảm giá sản phẩm",
      children: currentRecord?.discountPrice,
    },
    {
      key: useId(),
      label: "Giảm giá hóa đơn",
      children: currentRecord?.amount,
    },
    {
      key: useId(),
      label: "Số lượng sản phẩm tối thiểu",
      children: currentRecord?.minQuantityRequired,
    },
    {
      key: useId(),
      label: "Tổng số tiền tối thiểu",
      children: currentRecord?.minAmountRequired,
    },
    {
      key: useId(),
      label: "Nhân viên tạo",
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
      label: "Áp dụng cho tất cả cửa hàng?",
      children: currentRecord?.allStore === true ? "Có" : "Không",
    },
    {
      key: useId(),
      label: "Danh sách cửa hàng áp dụng",
      children: currentRecord?.stores?.map((ele, index) => (
        <div key={index}>
          <Link to={ROUTE.TENANT_APP.STORE.path + "/" + ele.id} target="_blank">
            {ele.name}
          </Link>
          <br />
        </div>
      )),
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
        title="Xem thông tin khuyến mãi"
        breadcrumbItems={breadcrumbItems}
      >
        <Space>
          <Button type="primary" onClick={handleEdit}>
            Cập nhật
          </Button>
          <Popconfirm
            title="Xóa khuyến mãi?"
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
      <Card title="Thông tin khuyến mãi" bordered={false} loading={loading}>
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

export default ViewPromote;
