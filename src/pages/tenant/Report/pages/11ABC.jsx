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
    title: "Phân tích ABC",
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
      title: 'Mã sản phẩm',
      dataIndex: 'id',
      key: 'id',
    },
    {
      title: 'Tên sản phẩm',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Tổng doanh thu',
      dataIndex: 'TongDoanhThu',
      key: 'TongDoanhThu',
    },
    {
      title: 'Tỉ lệ doanh thu',
      key: 'tile',
      render: (_, record) => {
        return <>{Math.round(record?.tile) + " %"}</>
      }
    },
    {
      title: 'Tích lũy',
      key: 'tichluy',
      render: (_, record) => {
        return <>{Math.round(record?.tichluy) + " %"}</>
      }
    },
    {
      title: 'Phân loại',
      dataIndex: 'class',
      key: 'class',
    },
  ];

  const handleLabel = (data) => {
    const source = data.map(ele => ({
      id: ele[0],
      name: ele[1],
      TongDoanhThu: ele[2],
      tile: ele[3],
      tichluy: ele[4],
      class: ele[5],
    }))

    if (source.length > 0 && source[0].tile > 80)
      source[0].class = "A";

    setDataSource(source);
  }

  const handleRunReport = async () => {

    const [from, to] = dates;

    try {
      const query = {from, to}
      console.log(query);
      
      const responseData = await ReportSerivce.getReport(11, query)
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
