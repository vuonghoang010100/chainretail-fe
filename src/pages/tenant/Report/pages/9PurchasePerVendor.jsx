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
    title: "Báo cáo nhập hàng theo nhà cung cấp",
  },
];

const Report = () => {
  // --------- store -----------
  const initStore = [{
    label: "Tất cả cửa hàng",
    value: -7,
  }]

  const [storeId, setStoreId] = useState(-1);
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
  const [dates, setDates] = useState(['2024-10-01', '2024-10-05']);
  const handleChange = (value) => {
    setDates(value)
  }

  // --------- date -----------
  const [dataSource , setDataSource] = useState([]);

  const columns = [
    {
      title: 'Mã nhà cung cấp',
      dataIndex: 'ngayBanHang',
      key: 'ngayBanHang',
    },
    {
      title: 'Tên nhà cung cấp',
      dataIndex: 'TongSoDonHang',
      key: 'TongSoDonHang',
    },
    {
      title: 'Tổng số đơn nhập hàng',
      dataIndex: 'TongDoanhThu',
      key: 'TongDoanhThu',
    },
    {
      title: 'Tổng giá trị nhập',
      dataIndex: 'LoiNhuan',
      key: 'LoiNhuan',
    },
  ];

  const handleLabel = (data) => {
    const source = data.map(ele => ({
      ngayBanHang: ele[0],
      TongSoDonHang: ele[1],
      TongDoanhThu: ele[2],
      LoiNhuan: ele[3],
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
      
      const responseData = await ReportSerivce.getReport(9, query)
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
