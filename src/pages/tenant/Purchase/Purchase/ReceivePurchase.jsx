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
import PurchaseForm2 from "./PurchaseForm2";
import { PurchaseService } from "@/apis/PurchaseService";

// current page path
const path = ROUTE.TENANT_APP.PURCHASE.path;

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
    title: "Nhận hàng",
  },
];

const ReceivePurchase = () => {
  const navigate = useNavigate();

  // -------------------- Page attr --------------------
  const { id } = useParams(); // id
  // eslint-disable-next-line no-unused-vars
  const [currentRecord, setCurrentRecord] = useState({}); // data
  const [formatRecord, setFormatRecord] = useState({}); // formatted data

  // -------------------- Fetch data --------------------
  useEffect(() => {
    let isMounted = false; // control mount data only one times

    const fetchData = async () => {
      try {
        // fetch data
        const record = await PurchaseService.getPurchaseById(id);
        console.info("Get record data:", record);

        // on get cuccessfully
        if (!isMounted) {
          // trim createTime, updateTime
          record?.createTime && delete record.createTime;
          record?.updateTime && delete record.updateTime;

          record?.bill && delete record.bill;
          record?.paymentStatus && delete record.paymentStatus;
          record?.receiveStatus && delete record.receiveStatus;
          record?.total && delete record.total;

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

          record.contractId = null;
          if (record.contract) {
            recordFormatted.contract = {
              label: `${record.contract.id}`,
              key: record.contract.id,
              value: record.contract.id,
            };
            record.contractId = record.contract.id;
            delete record.contract;
          }

          record.storeId = null;
          if (record.store) {
            recordFormatted.store = {
              label: `${record.store.name}`,
              key: record.store.id,
              value: record.store.id,
            };
            record.storeId = record.store.id;
            delete record.store;
          }

          recordFormatted.details = record.details.map((ele) => ({
            id: ele.id,
            product: {
              label: `${ele.product.id} - ${ele.product.name}`,
              key: ele.product.id,
              value: ele.product.id,
              disabled: true,
            },
            purchaseAmount: ele.purchaseAmount,
            purchasePrice: ele.purchasePrice,
          }));

          setCurrentRecord(record);
          setFormatRecord(recordFormatted);
        }
      } catch (error) {
        console.error("Error:", error);
        message.error("Không thể tải dữ liệu đơn nhập hàng!");
      }
    };

    fetchData();
    return () => {
      isMounted = true;
    };
  }, [id]);

  const handleReceive = async (data) => {
    await PurchaseService.receivePurchase(id, data);

    navigate(path);
    return true;
  }

  return (
    <PageContent>
      <PageHeader title="Nhận hàng" breadcrumbItems={breadcrumbItems} />
      <ContentBox>
        <Title marginBot>Thông tin đơn nhập hàng</Title>
        <PurchaseForm2
          useForCreate={false}
          onFinish={handleReceive}
          initRecord={formatRecord}
        />
      </ContentBox>
    </PageContent>
  );
};

export default ReceivePurchase;
