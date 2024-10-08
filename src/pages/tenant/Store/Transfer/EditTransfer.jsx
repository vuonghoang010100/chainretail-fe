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
import TransferForm from "./TransferForm";
import { TransferService } from "@/apis/TransferService";

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
    title: "Cập nhật",
  },
];

const EditTransfer = () => {
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
        const record = await TransferService.getTransferById(id);
        console.info("Get record data:", record);

        // on get cuccessfully
        if (!isMounted) {
          // trim createTime, updateTime
          record?.createTime && delete record.createTime;
          record?.updateTime && delete record.updateTime;

          // convert data
          let recordFormatted = { ...record };

          record.fromStoreId = null;
          if (record.fromStore) {
            recordFormatted.fromStore = {
              label: `${record.fromStore.name}`,
              key: record.fromStore.id,
              value: record.fromStore.id,
            };
            record.fromStoreId = record.fromStore.id;
            delete record.fromStore;
          }

          record.storeId = null;
          if (record.toStore) {
            recordFormatted.toStore = {
              label: `${record.toStore.name}`,
              key: record.toStore.id,
              value: record.toStore.id,
            };
            record.storeId = record.toStore.id;
            delete record.toStore;
          }

          recordFormatted.details = record.details.map((ele) => ({
            id: ele.id,
            product: {
              label: `${ele.product.id} - ${ele.product.name}`,
              key: ele.product.id,
              value: ele.product.id,
              disabled: true,
            },
            batch: {
              label: `Lô ${ele.fromBatch.id}`,
              key: ele.fromBatch.id,
              value: ele.fromBatch.id,
              disabled: true,
            },
            quantity: ele.quantity,
          }));

          setCurrentRecord(record);
          setFormatRecord(recordFormatted);
        }
      } catch (error) {
        console.error("Error:", error);
        message.error("Không thể tải dữ liệu Đơn vận chuyển giữa các cửa hàng!");
      }
    };

    fetchData();
    return () => {
      isMounted = true;
    };
  }, [id]);

  // -------------------- Update Customer --------------------
  const handleUpdate = async (updateData) => {
    const data = {
      note: updateData.note,
      status: updateData.status,
    }

    // get change value
    let changedData = Object.fromEntries(
      Object.entries(data).filter(
        ([key, value]) => value !== currentRecord[key]
      )
    );

    console.info("changed data", changedData);

    // case no info change, update is no needed
    if (!changedData || Object.keys(changedData)?.length === 0) {
      return false;
    }

    // Call update API
    await TransferService.putTransfer(id, data);
    navigate(path);
    return true;
  };

  return (
    <PageContent>
      <PageHeader 
        title="Cập nhật Đơn vận chuyển"
        breadcrumbItems={breadcrumbItems} 
      />
      <ContentBox>
        <Title marginBot>Thông tin Đơn vận chuyển giữa các cửa hàng</Title>
        <TransferForm
          useForCreate={false}
          onFinish={handleUpdate}
          initRecord={formatRecord}
        />
      </ContentBox>
    </PageContent>
  );
};

export default EditTransfer;
