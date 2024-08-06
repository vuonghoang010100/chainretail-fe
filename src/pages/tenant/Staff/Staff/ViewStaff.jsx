import React, { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { message, Descriptions } from "antd";
import { HomeOutlined } from "@ant-design/icons";
import { PageContent, PageHeader, ContentBox } from "@/components/layout/PageContent";
import { Title } from "@/components/common/Title";

// current page path
const path = "/staff";

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

const ViewStaff = () => {
  // -------------------- Page attr --------------------
  const { id } = useParams(); // id
  const [currentStaff, setCurrentStaff] = useState({}); // data

  // -------------------- Fetch data --------------------
  useEffect(() => {
    let isMounted = false; // control mount data only one times

    const fetchData = async () => {
      try {
        // const customer = await CustomerAPI.getCustomerById(id);
        // // on get cuccessfully
        // !isMounted && setCurrentCustomer(customer);

        // fake
        !isMounted && setCurrentStaff({
          "id": "EMP000000001",
          "full_name": "string",
          "email": "user@example.com",
          "phone_number": "123123",
          "role": "Nhân viên",
          "branch_name": "string",
          "date_of_birth": "2024-03-27",
          "gender": "Nam",
          "province": "string",
          "district": "string",
          "address": "string",
          "status": "Đang làm việc",
          "note": "string",
        });

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
  // FIXME: responsive
  const infoItems = [
    {
      key: "1",
      label: "Tên nhân viên",
      children: currentStaff?.full_name,
    },
    {
      key: "2",
      label: "Mã nhân viên",
      children: currentStaff?.id,
      span: 2,
    },
    {
        key: "3",
        label: "Giới tính",
        children: currentStaff?.gender,
      },
    {
      key: "4",
      label: "Ngày sinh",
      children: currentStaff?.date_of_birth,
      span: 2,
    },
    {
        key: "5",
        label: "Số điện thoại",
        children: currentStaff?.phone_number
      },
    {
      key: "6",
      label: "Email",
      children: currentStaff?.email,
      span:2,
    },
    {
      key: "7",
      label: "Tỉnh/Thành phố",
      children: currentStaff?.province,
    },
    {
      key: "8",
      label: "Quận/Huyện",
      children: currentStaff?.district,
    },
    {
      key: "9",
      label: "Địa chỉ",
      children: currentStaff?.address,
    },
    {
        key: "10",
        label: "Cửa hàng",
        children: currentStaff?.branch_name,
      },
    {
      key: "11",
      label: "Chức vụ",
      children: currentStaff?.role,
    },
    {
      key: "12",
      label: "Trạng thái",
      children: currentStaff?.status,
    },
    {
      key: "11",
      label: "Ghi chú",
      children: currentStaff?.note,
      span: 3,
    },
  ];

  return (
    <PageContent>
      <PageHeader breadcrumbItems={breadcrumbItems} />
      <ContentBox>
        <Title marginBot>
          Thông tin nhân viên
        </Title>
        <Descriptions bordered items={infoItems} />
      </ContentBox>
    </PageContent>
  );
}

export default ViewStaff;