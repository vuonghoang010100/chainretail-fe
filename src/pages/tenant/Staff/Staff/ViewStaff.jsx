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
    title: "Xem",
  },
];

const { Text } = Typography;

const ViewStaff = () => {
  // -------------------- Page attr --------------------
  const { id } = useParams(); // id
  const [currentRecord, setCurrentRecord] = useState({}); // data

  // -------------------- Fetch data --------------------
  useEffect(() => {
    let isMounted = false; // control mount data only one times

    const fetchData = async () => {
      try {
        const record = await StaffSerivce.getStaffById(id);
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
      label: "Tên nhân viên",
      children: <Text strong>{currentRecord?.fullName}</Text>,
    },
    {
      key: useId(),
      label: "Mã nhân viên",
      children: currentRecord?.id,
    },
    {
      key: useId(),
      label: "Giới tính",
      children: currentRecord?.gender,
    },
    {
      key: useId(),
      label: "Ngày sinh",
      children: currentRecord?.dob,
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
    {
      key: useId(),
      label: "Phân quyền",
      children: currentRecord?.roles?.map((ele, index) => (
        <Text key={index} code>
          {ele.name}
        </Text>
      )),
    },
    {
      key: useId(),
      label: "Cửa hàng làm việc",
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

  return (
    <PageContent>
      <PageHeader breadcrumbItems={breadcrumbItems} />
      <ContentBox>
        <Title marginBot>Thông tin nhân viên</Title>
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

export default ViewStaff;
