import React, { useState, useEffect, useId } from "react";
import { Link, useParams } from "react-router-dom";
import { message, Descriptions, Typography } from "antd";
import { HomeOutlined } from "@ant-design/icons";
import {
  PageContent,
  PageHeader,
  ContentBox,
} from "@/components/layout/PageContent";
import { Title } from "@/components/common/Title";
import { ROUTE } from "@/constants/AppConstant";
import { StoreService } from "@/apis/StoreService";

// current page path
const path = ROUTE.TENANT_APP.STORE.path;

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
    title: "Xem",
  },
];

const { Text } = Typography;

const ViewStore = () => {
  // -------------------- Page attr --------------------
  const { id } = useParams(); // id
  const [currentRecord, setCurrentRecord] = useState({}); // data

  // -------------------- Fetch data --------------------
  useEffect(() => {
    let isMounted = false; // control mount data only one times

    const fetchData = async () => {
      try {
        const record = await StoreService.getStoreById(id);
        console.log(record);

        // on get cuccessfully
        !isMounted && setCurrentRecord(record);
      } catch (error) {
        message.error("Không thể tải dữ liệu nhân viên!");
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
      label: "Tên hiển thị",
      children: <Text strong>{currentRecord?.name}</Text>,
    },
    {
      key: useId(),
      label: "Mã cửa hàng",
      children: currentRecord?.id,
    },
    {
      key: useId(),
      label: "Tên cửa hàng",
      children: currentRecord?.fullName,
    },
    {
      key: useId(),
      label: "Số điện thoại",
      children: currentRecord?.phone,
    },
    {
      key: useId(),
      label: "Email",
      children: currentRecord?.email,
    },
    {
      key: useId(),
      label: "Tỉnh/Thành phố",
      children: currentRecord?.province,
    },
    {
      key: useId(),
      label: "Quận/Huyện",
      children: currentRecord?.district,
    },
    {
      key: useId(),
      label: "Địa chỉ",
      children: currentRecord?.address,
    },
    {
      key: useId(),
      label: "Trạng thái",
      children: currentRecord?.status,
    },
    {
      key: useId(),
      label: "Ghi chú",
      children: currentRecord?.note,
    },
  ];

  return (
    <PageContent>
      <PageHeader breadcrumbItems={breadcrumbItems} />
      <ContentBox>
        <Title marginBot>Thông tin cửa hàng</Title>
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
      </ContentBox>
    </PageContent>
  );
};

export default ViewStore;
