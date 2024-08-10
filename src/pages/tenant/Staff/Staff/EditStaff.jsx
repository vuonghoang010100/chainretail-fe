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
import StaffForm from "./StaffForm";
import { StaffSerivce } from "@/apis/StaffService";
import { ROUTE } from "@/constants/AppConstant";

// current page path
const path = ROUTE.TENANT_APP.STAFF.path;

const breadcrumbItems = [
  {
    title: (
      <Link to="/">
        <HomeOutlined />
      </Link>
    ),
  },
  {
    title: <Link to={`${path}`}>Nhân viên</Link>,
  },
  {
    title: "Cập nhật",
  },
];

const EditStaff = () => {
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
        const record = await StaffSerivce.getStaffById(id);
        console.info("Get record data:", record);

        // on get cuccessfully
        if (!isMounted) {
          // trim createTime, updateTime
          record?.createTime && delete record.createTime;
          record?.updateTime && delete record.updateTime;

          // convert data
          let recordFormatted = { ...record };

          // convert list select
          recordFormatted.roles = listToSelectItems(recordFormatted.roles);
          recordFormatted.stores = listToSelectItems(recordFormatted.stores);
          // convert list id for compare
          record.roles = listToIdList(record.roles);
          record.stores = listToIdList(record.stores);

          console.log(recordFormatted);
          setCurrentRecord(record);
          setFormatRecord(recordFormatted);
        }
      } catch (error) {
        console.error("Error:", error);
        message.error("Không thể tải dữ liệu nhân viên!");
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
    // for case list => compare toString()
    changedData?.roles.toString() === currentRecord?.roles.toString() &&
      delete changedData?.roles;
    changedData?.stores.toString() === currentRecord?.stores.toString() &&
      delete changedData?.stores;

    console.info("changed data", changedData);

    // case no info change, update is no needed
    if (!changedData || Object.keys(changedData)?.length === 0) {
      return false;
    }

    // Call update API
    await StaffSerivce.putStaff(id, updateData);
    navigate(path);
    return true;
  };

  return (
    <PageContent>
      <PageHeader breadcrumbItems={breadcrumbItems} />
      <ContentBox>
        <Title marginBot>Thông tin nhân viên</Title>
        <StaffForm
          useForCreate={false}
          onFinish={handleUpdate}
          initRecord={formatRecord}
        />
      </ContentBox>
    </PageContent>
  );
};

export default EditStaff;
