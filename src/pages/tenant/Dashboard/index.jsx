import React, { useEffect, useState } from "react";
import {
  PageContent,
  PageHeader,
} from "@/components/layout/PageContent";

import { HomeOutlined } from "@ant-design/icons";
import { Link } from "react-router-dom";
import { Avatar, Card, Flex, message, Statistic, Table } from "antd";
import { RangePickerx } from "@/components/common/Input/DatePicker";
import { DashboardService } from "@/apis/DashboardService";
import { ROUTE } from "@/constants/AppConstant";

const noImageurl = "https://retail-chain-sale-ms.s3.ap-southeast-2.amazonaws.com/no_image_450.png"

const breadcrumbItems = [
  {
    title: (
      <Link to="/">
        <HomeOutlined />
      </Link>
    ),
  },
  {
    title: "Dashboard",
  },
];

const Dashboard = () => {

  const cardStyle = {
    flex: "0 0 23%",
  };

  const cardStyle2 = {
    flex: "0 0 48%",
  };

  const cardStyle3 = {
    flex: "0 0 98%",
  };

  // --------- attr -----------
  const [metrics, setMetrics] = useState({})
  

  // --------- store -----------
  const [stores, setStores] = useState([]);

  const columnsStore = [
    {
      title: "Cửa hàng",
      key: "store",
      render: (_, record) => {
        return <Link to={`${ROUTE.TENANT_APP.STORE.path}/${record.id}`} target="_blank" >{record.name}</Link>
      }
    },
    {
      title: "Số đơn bán",
      dataIndex: "orders",
      key: "orders",
    },
    {
      title: "Doanh thu",
      key: "revenue",
      render: (_, record) => {
        return <>{`${record.revenue}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',') + " VND"}</>
      }
    },
  ]

  // --------- employee -----------
  const [employees, setEmployees] = useState([]);

  const columnsEm = [
    {
      title: "Nhân viên",
      key: "store",
      render: (_, record) => {
        return <Link to={`${ROUTE.TENANT_APP.STORE.path}/${record.id}`} target="_blank" >{record.name}</Link>
      }
    },
    {
      title: "Số đơn bán",
      dataIndex: "orders",
      key: "orders",
    },
    {
      title: "Doanh thu",
      key: "revenue",
      render: (_, record) => {
        return <>{`${record.revenue}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',') + " VND"}</>
      }
    },
  ]

  // --------- product -----------
  const [products, setProducts] = useState([]);

  const columnsProduct = [
    {
      title: "Sản phẩm",
      key: "sp",
      render: (_, record) => {
        return <Link to={`${ROUTE.TENANT_APP.STORE.path}/${record.id}`} target="_blank" >
          <Avatar shape="square" alt="" size={48} src={record.url ? record.url : noImageurl} />
          {record.name}
        </Link>
      }
    },
    {
      title: "Số lượng bán",
      dataIndex: "numSell",
      key: "numSell",
    },
    {
      title: "Doanh thu",
      key: "revenue",
      render: (_, record) => {
        return <>{`${record.revenue}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',') + " VND"}</>
      }
    },
  ]

  // --------- fetch -----------
  const [dates, setDates] = useState(['2024-10-01', '2024-10-05']);
  const handleChange = (value) => {
    setDates(value)
  }

  useEffect(() => {
    const [from, to] = dates;

    if (!from || !to)
      return;

    const fetchData = async () => {
      try {
        const data = await DashboardService.getAll(from, to);
        console.log(data);

        setMetrics(data);

        setStores(data.topStore.map(ele => ({
          id: ele[0],
          name: ele[1],
          orders: ele[2],
          revenue: ele[3]
        })));

        setEmployees(data.topEmployee.map(ele => ({
          id: ele[0],
          name: ele[1],
          orders: ele[2],
          revenue: ele[3]
        })));

        setProducts(data.topProduct.map(ele => ({
          id: ele[0],
          name: ele[1],
          url: ele[2],
          numSell: ele[3],
          revenue: ele[4]
        })))

        
      } catch (error) {
        message.error("Không thể tải dữ liệu!")
      }
    }
    
    fetchData();

  }, [dates])



  return (
    <PageContent>
      <PageHeader breadcrumbItems={breadcrumbItems}>
        <RangePickerx onChange={handleChange} value={dates}/>
      </PageHeader>

      <Flex gap="large" wrap>
        <Card bordered={false} style={cardStyle}>
          <Statistic title="Doanh thu (đ)" value={metrics.revenue} />
        </Card>

        <Card bordered={false} style={cardStyle}>
          <Statistic
            title="Lợi nhuận (đ)"
            value={metrics.profit}
          />
        </Card>

        <Card bordered={false} style={cardStyle}>
          <Statistic title="Tổng số đơn đặt hàng" value={metrics.totalOrders} />
        </Card>

        <Card bordered={false} style={cardStyle}>
          <Statistic
            title="Giá trị đơn đặt hàng trung bình (đ)"
            value={Math.floor(metrics.avgOrderValue)}
          />
        </Card>

        <Card bordered={false} style={cardStyle}>
          <Statistic
            title="Kích thước giỏ hàng trung bình"
            value={Math.floor(metrics.avgBasket*100)/100}
          />
        </Card>

        <Card bordered={false} style={cardStyle}>
          <Statistic
            title="Số lượng sản phẩm đã bán"
            value={metrics.totalSellProduct}
          />
        </Card>

        <Card bordered={false} style={cardStyle}>
          <Statistic title="Khách hàng mới" value={metrics.newCustomer} />
        </Card>

        <Card
          title="Top cửa hàng có doanh thu cao nhất"
          bordered={false}
          style={cardStyle2}
        >
          <Table dataSource={stores} columns={columnsStore} />
        </Card>

        <Card
          title="Top nhân viên bán hàng"
          bordered={false}
          style={cardStyle2}
        >
          <Table dataSource={employees} columns={columnsEm} />
        </Card>


        <Card
          title="Top sản phẩm bán chạy nhất"
          bordered={false}
          style={cardStyle3}
        >
          <Table dataSource={products} columns={columnsProduct} />
        </Card>



      </Flex>
      <br />
    </PageContent>
  );
};

export default Dashboard;
