import React, { useState } from "react";
import {
  ContentBox,
  PageContent,
  PageHeader,
} from "@/components/layout/PageContent";
import { HomeOutlined } from "@ant-design/icons";
import { Link } from "react-router-dom";
import { Button, message, Space, Table } from "antd";
import { RangePickerx } from "@/components/common/Input/DatePicker";
import { ReportSerivce } from "@/apis/ReportService";

const breadcrumbItems = [
  {
    title: (
      <Link to="/">
        <HomeOutlined />
      </Link>
    ),
  },
  {
    title: <Link to={"/report"}>Báo cáo</Link>,
  },
  {
    title: "Báo cáo nhập hàng theo cửa hàng",
  },
];

const Report = () => {

  // --------- date -----------
  const [dates, setDates] = useState(['2024-10-01', '2024-10-05']);
  const handleChange = (value) => {
    setDates(value)
  }

  // --------- REPORT -----------
  const [dataSource , setDataSource] = useState([]);

  const columns = [
    {
      title: 'Mã cửa hàng',
      dataIndex: 'MaSanPham',
      key: 'MaSanPham',
    },
    {
      title: 'Tên cửa hàng',
      dataIndex: 'TenSanPham',
      key: 'TenSanPham',
    },
    {
      title: 'Tổng số đơn nhập hàng',
      dataIndex: 'TongSoLuongBan',
      key: 'TongSoLuongBan',
    },
    {
      title: 'Tổng giá trị nhập',
      dataIndex: 'TongDoanhThu',
      key: 'TongDoanhThu',
    }
  ];

  const handleLabel = (data) => {
    const source = data.map(ele => ({
      MaSanPham: ele[0],
      TenSanPham: ele[1],
      TongSoLuongBan: ele[2],
      TongDoanhThu: ele[3],
    }))

    setDataSource(source);
  }

  const handleRunReport = async () => {

    const [from, to] = dates;

    try {
      const query = {from, to}
      console.log(query);
      
      const responseData = await ReportSerivce.getReport(5, query)
      handleLabel(responseData);
      
    } catch (error) {
      message.info("Không thể tạo báo cáo!");
      console.log(error);
      
    }
  }

  return (
    <PageContent>
      <PageHeader breadcrumbItems={breadcrumbItems}>
        <Space>
          <RangePickerx onChange={handleChange} value={dates}/>
          
          <Button type="primary" onClick={handleRunReport}>Tạo báo cáo</Button>
        </Space>
      </PageHeader>

      <ContentBox>
        <Table dataSource={dataSource} columns={columns} />
      </ContentBox>
    </PageContent>
  );
};

export default Report;
