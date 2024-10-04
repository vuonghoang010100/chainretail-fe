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
import BillForm from "./BillForm";
import { StoreService } from "@/apis/StoreService";
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
    title: "Cập nhật",
  },
];

const EditBill = () => {
  const navigate = useNavigate();

  // -------------------- Page attr --------------------
  const { id } = useParams(); // id
  const [currentRecord, setCurrentRecord] = useState({}); // data
  const [formatRecord, setFormatRecord] = useState({}); // formatted data

  // -------------------- Fetch data --------------------
   // Helper functions
   const listToSelectItems = (arrays) => {
    return arrays.map((ele) => ({
      label: `${ele.id}`,
      key: ele.id,
      value: ele.id,
    }));
  };

  const listToIdList = (arrays) => {
    return arrays.map((ele) => ele.id);
  };

  useEffect(() => {
    let isMounted = false; // control mount data only one times

    const fetchData = async () => {
      try {
        // fetch data
        const record = await BillService.getBillById(id);
        console.info("Get record data:", record);

        // on get cuccessfully
        if (!isMounted) {
          // trim createTime, updateTime
          record?.createTime && delete record.createTime;
          record?.updateTime && delete record.updateTime;

          // convert data
          let recordFormatted = { ...record };

          record.vendorId = null;
          if (record.vendor) {
            recordFormatted.vendor = {
              label: `${record.vendor.fullName}`,
              key: record.vendor.id,
              value: record.vendor.id,
            };
            record.vendorId = record.vendor.id;
            delete record.vendor;
          }

          // convert list select
          recordFormatted.purchases = listToSelectItems(recordFormatted.purchases);
          // convert list id for compare
          record.purchases = listToIdList(record.purchases);


          setCurrentRecord(record);
          setFormatRecord(recordFormatted);
        }
      } catch (error) {
        console.error("Error:", error);
        message.error("Không thể tải dữ liệu Hóa đơn nhập hàng!");
      }
    };

    fetchData();
    return () => {
      isMounted = true;
    };
  }, [id]);

  // -------------------- Update Customer --------------------
  const handleUpdate = async (updateData) => {
    delete updateData.employeeId;
    delete updateData.purchaseIds;

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
    await BillService.putBill(id, updateData);
    navigate(path);
    return true;
  };

  return (
    <PageContent>
      <PageHeader 
        title="Cập nhật Hóa đơn nhập hàng"
        breadcrumbItems={breadcrumbItems} 
      />
      <ContentBox>
        <Title marginBot>Thông tin Hóa đơn nhập hàng</Title>
        <BillForm
          useForCreate={false}
          onFinish={handleUpdate}
          initRecord={formatRecord}
        />
      </ContentBox>
    </PageContent>
  );
};

export default EditBill;
