import React, { useState, useEffect } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { message, Tabs } from "antd";
import { HomeOutlined } from "@ant-design/icons";
import {
  PageContent,
  PageHeader,
  ContentBox,
} from "@/components/layout/PageContent";
import { Title } from "@/components/common/Title";
import StaffForm from "./StaffForm";

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
    title: "Chỉnh sửa",
  },
];

const EditStaff = () => {
  const navigate = useNavigate();

  // -------------------- Page attr --------------------
  const { id } = useParams(); // id
  const [currentStaff, setCurrentStaff] = useState({}); // data
  const [formatStaff, setFormatStaff] = useState({}); // formatted data

  // -------------------- Fetch data --------------------
  useEffect(() => {
    let isMounted = false; // control mount data only one times

    const fetchData = async () => {
      try {
        //  const customer = await CustomerAPI.getCustomerById(id);

        // fake
        await new Promise((resolve) => setTimeout(resolve, 500));
        const staff = {
          id: "EMP000000001",
          full_name: "string",
          email: "user@example.com",
          phone_number: "123123",
          role: "Quản lý",
          branch_name: "string",
          date_of_birth: "2024-03-27",
          gender: "Nam",
          province: "string",
          district: "string",
          address: "string",
          status: "Đang làm việc",
          note: "string",
        };

        // on get cuccessfully
        if (!isMounted) {
          // trim null data
          let staffFormatted = Object.fromEntries(
            Object.entries(staff).filter(([_, value]) => !!value)
          );

          console.log(staff);

          setCurrentStaff(staff);
          setFormatStaff(staffFormatted);
        }
      } catch (error) {
        console.error("aa", error);
        message.error("Không thể tải dữ liệu nhân viên!");
      }
    };

    fetchData();
    return () => {
      isMounted = true;
    };
  }, [id]);

  // -------------------- Update Customer --------------------
  const updateStaff = async (staffData) => {
    // get change value
    let changedData = Object.fromEntries(
      Object.entries(staffData).filter(
        ([key, value]) => value !== currentStaff[key]
      )
    );

    const unWatchs = [];
    let removeData = Object.fromEntries(
      Object.entries(currentStaff).filter(([key, value]) => {
        if (unWatchs.includes(key)) {
          return false;
        }
        return !!value && !staffData[key];
      })
    );

    removeData = Object.fromEntries(
      Object.entries(removeData).map(([key, _]) => [key, null])
    );

    changedData = {
      ...changedData,
      ...removeData,
    };

    // TODO: unset

    console.info("changed data", changedData);

    if (Object.keys(changedData).length === 0) {
      return false;
    }

    try {
      // await CustomerAPI.putCustomer(id, changedData);
      await new Promise((resolve) => setTimeout(resolve, 1000));

      navigate(path);
      return true;
    } catch (error) {
      throw error;
    }
  };

  const tabItems = [
    {
        key: "1",
        label: "Thông tin nhân viên",
        children: (
            <ContentBox>
                <StaffForm
                    useForCreate={false}
                    onFinish={updateStaff}
                    initStaff={formatStaff}
                />
            </ContentBox>
        ),
    },
    {
        key: "2",
        label: "Phân quyền nhân viên",
        children: (
            <ContentBox>
                <p> Bảng phân quyền nhân viên </p>
            </ContentBox>
          
        )
      },
  
  ]
  return (
    <PageContent>
      <PageHeader breadcrumbItems={breadcrumbItems} />
      <br />
      <Tabs defaultActiveKey="1" items={tabItems}/>
    </PageContent>
  );
};

export { EditStaff };
