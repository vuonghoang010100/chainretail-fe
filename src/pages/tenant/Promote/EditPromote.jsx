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
import PromoteForm from "./PromoteForm";
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
    title: "Cập nhật",
  },
];

const EditPromote = () => {
  const navigate = useNavigate();

  // -------------------- Page attr --------------------
  const { id } = useParams(); // id
  const [currentRecord, setCurrentRecord] = useState({}); // data
  const [formatRecord, setFormatRecord] = useState({}); // formatted data

  // -------------------- Fetch data --------------------
  // Helper functions
  const listToSelectItems = (arrays) => {
    return arrays.map((ele) => ({
      label: `${ele.name}`,
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
        const record = await PromoteService.getPromoteById(id);
        console.info("Get record data:", record);

        // on get cuccessfully
        if (!isMounted) {
          // trim createTime, updateTime
          record?.createTime && delete record.createTime;
          record?.updateTime && delete record.updateTime;

          // convert data
          let recordFormatted = { ...record };

          record.productId = null;
          if (record.product) {
            recordFormatted.product = {
              label: `${record.product.id} - ${record.product.name} - Giá bán: ${record.product.price}`,
              key: record.product.id,
              value: record.product.id,
            };
            record.productId = record.product.id;
            delete record.product;
          }

          // convert list select
          recordFormatted.stores = listToSelectItems(recordFormatted.stores);
          // convert list id for compare
          record.stores = listToIdList(record.stores);
          

          setCurrentRecord(record);
          setFormatRecord(recordFormatted);
        }
      } catch (error) {
        console.error("Error:", error);
        message.error("Không thể tải dữ liệu khuyến mãi!");
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

    if (Object.keys(changedData).length === 1 && updateData.allStore === currentRecord.allStore && currentRecord.allStore === true)
      return false;

    // Call update API
    await PromoteService.putPromote(id, updateData);
    navigate(path);
    return true;
  };

  return (
    <PageContent>
      <PageHeader 
        title="Cập nhật khuyến mãi"
        breadcrumbItems={breadcrumbItems} 
      />
      <ContentBox>
        <Title marginBot>Thông tin khuyến mãi</Title>
        <PromoteForm
          useForCreate={false}
          onFinish={handleUpdate}
          initRecord={formatRecord}
        />
      </ContentBox>
    </PageContent>
  );
};

export default EditPromote;
