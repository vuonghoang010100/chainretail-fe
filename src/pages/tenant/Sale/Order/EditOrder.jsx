import React, { useState, useEffect } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { message } from "antd";
import { HomeOutlined } from "@ant-design/icons";
import {
  PageContent,
  PageHeader,
  ContentBox,
} from "@/components/layout/PageContent";
import { Title } from "@/components/common/Title";
import { ROUTE } from "@/constants/AppConstant";
import OrderForm from "./OrderForm";
import { SaleService } from "@/apis/SaleService";

// current page path
const path = ROUTE.TENANT_APP.ORDER.path;

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
    title: "Cập nhật",
  },
];

const EditOrder = () => {
  const navigate = useNavigate();

  // -------------------- Page attr --------------------
  const { id } = useParams(); // id
  const [currentRecord, setCurrentRecord] = useState({}); // data
  const [formatRecord, setFormatRecord] = useState({}); // formatted data

  // -------------------- Fetch data --------------------
  useEffect(() => {
    let isMounted = false; // control mount data only one times

    const fetchData = async () => {
      try {
        // fetch data
        const record = await SaleService.getOrderById(id);
        console.info("Get record data:", record);

        // on get cuccessfully
        if (!isMounted) {
          // trim createTime, updateTime
          record?.createTime && delete record.createTime;
          record?.updateTime && delete record.updateTime;

          const x = {
            id: record.id,
            status: record?.status,
            paymentStatus: record?.invoice?.paymentStatus
          }

          // convert data
          let recordFormatted = { ...x };

          setCurrentRecord(x);
          setFormatRecord(recordFormatted);
        }
      } catch (error) {
        console.error("Error:", error);
        message.error("Không thể tải dữ liệu đơn đặt hàng!");
      }
    };

    fetchData();
    return () => {
      isMounted = true;
    };
  }, [id]);

  // -------------------- Update Customer --------------------
  const handleUpdate = async (updateData) => {
    // get change value
    let changedData = Object.fromEntries(
      Object.entries(updateData).filter(
        ([key, value]) => value !== currentRecord[key]
      )
    );

    console.info("changed data", changedData);

    // case no info change, update is no needed
    if (!changedData || Object.keys(changedData)?.length === 0) {
      return false;
    }

    // Call update API
    await SaleService.putOrder(id, updateData);
    navigate(path);
    return true;
  };

  return (
    <PageContent>
      <PageHeader 
        title="Cập nhật đơn đặt hàng"
        breadcrumbItems={breadcrumbItems} 
      />
      <ContentBox>
        <Title marginBot>Thông tin đơn đặt hàng</Title>
        <OrderForm
          useForCreate={false}
          onFinish={handleUpdate}
          initRecord={formatRecord}
        />
      </ContentBox>
    </PageContent>
  );
};

export default EditOrder;
