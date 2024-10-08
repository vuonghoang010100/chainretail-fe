import React, { useState, useEffect } from "react";
import {
  ContentBox,
  PageContent,
  PageHeader,
} from "@/components/layout/PageContent";
import { HomeOutlined } from "@ant-design/icons";
import { Link } from "react-router-dom";
import { Button, message, Select, Space, Table } from "antd";
import { normalizeString } from "@/utils";
import { StoreService } from "@/apis/StoreService";
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
    title: "Báo cáo bán hàng theo nhân viên",
  },
];

const Report = () => {
  // --------- store -----------
  const initStore = [{
    label: "Tất cả cửa hàng",
    value: -7,
  }]

  const [storeId, setStoreId] = useState(null);
  const [stores, setStores] = useState(initStore);

  const handleChangeStore = (id) => {
    setStoreId(id);
  };

  const filterOption = (input, option) =>
    normalizeString(option.label).includes(normalizeString(input));

  // Fetch categories on first render
  useEffect(() => {
    let isMounted = false; // control mount data only one times

    const fetchData = async () => {
      try {
        const dataResponse = await StoreService.getWorkStore();
        console.log(dataResponse);

        if (!isMounted) {
          const sts = dataResponse.map((store) => ({
            label: store.name,
            value: store.id,
          }));
          setStores([...initStore, ...sts]);
        }
      } catch (error) {
        message.error("Không thể tải dữ liệu cửa hàng!");
      }
    };

    fetchData();

    // clean function
    return () => {
      isMounted = true;
    };
  }, []);

  // --------- date -----------
  const currentDate = new Date().toLocaleDateString('en-CA').slice(0, 10);
  const [dates, setDates] = useState([currentDate.slice(0,8) + "01", currentDate]);
  const handleChange = (value) => {
    setDates(value)
  }

  // --------- REPORT -----------
  const [dataSource , setDataSource] = useState([]);

  const columns = [
    {
      title: 'Mã nhân viên',
      dataIndex: 'id',
      key: 'id',
    },
    {
      title: 'Tên nhân viên',
      dataIndex: 'TenNhanVien',
      key: 'TenNhanVien',
    },
    {
      title: 'Tổng số đơn hàng',
      dataIndex: 'TongSoDonHang',
      key: 'TongSoDonHang',
    },
    {
      title: 'Tổng doanh thu',
      dataIndex: 'TongDoanhThu',
      key: 'TongDoanhThu',
    },
    {
      title: 'Lợi nhuận',
      dataIndex: 'LoiNhuan',
      key: 'LoiNhuan',
    },
  ];

  const handleLabel = (data) => {
    const source = data.map(ele => ({
      id: ele[0],
      TenNhanVien: ele[1],
      TongSoDonHang: ele[2],
      TongDoanhThu: ele[3],
      LoiNhuan: ele[4],
    }))

    setDataSource(source);
  }

  const handleRunReport = async () => {
    if (storeId !== -7 && !storeId)
      return;

    const [from, to] = dates;

    try {
      const query = {from, to, storeId}
      console.log(query);
      
      const responseData = await ReportSerivce.getReport(4, query)
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
          <Select
            style={{
              width: "300px",
            }}
            showSearch
            allowClear
            filterOption={filterOption}
            filterSort={(optionA, optionB) =>
              (optionA?.label ?? "")
                .toLowerCase()
                .localeCompare((optionB?.label ?? "").toLowerCase())
            }
            options={stores}
            onChange={handleChangeStore}
            placeholder="Chọn cửa hàng"
          />
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
