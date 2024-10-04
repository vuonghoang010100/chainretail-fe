import React from "react";
import {
  PageContent,
  PageHeader,
} from "@/components/layout/PageContent";

import { HomeOutlined } from "@ant-design/icons";
import { Link } from "react-router-dom";
import { Card, Flex, Statistic } from "antd";

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
  const saleStatic = {
    doanhthu: "125000",
    tangdoanhthu: "2",
    dathang: "68",
    giatrigiohang: "27100",
    kichthuocgiohang: "2.24",
    spdaban: "1241",
    khachhangmoi: "46",
  };

  const cardStyle = {
    flex: "0 0 23%",
  };

  const cardStyle2 = {
    flex: "0 0 48%",
  };

  return (
    <PageContent>
      <PageHeader breadcrumbItems={breadcrumbItems}></PageHeader>

      <Flex gap="large" wrap>
        <Card bordered={false} style={cardStyle}>
          <Statistic title="Doanh thu (VND)" value={saleStatic.doanhthu} />
        </Card>

        <Card bordered={false} style={cardStyle}>
          <Statistic
            title="Chỉ số tăng trưởng doanh thu (%)"
            value={saleStatic.tangdoanhthu}
          />
        </Card>

        <Card bordered={false} style={cardStyle}>
          <Statistic title="Tổng số đơn đặt hàng" value={saleStatic.dathang} />
        </Card>

        <Card bordered={false} style={cardStyle}>
          <Statistic
            title="Giá trị đơn đặt hàng trung bình (VND)"
            value={saleStatic.giatrigiohang}
          />
        </Card>

        <Card bordered={false} style={cardStyle}>
          <Statistic
            title="Kích thước giỏ hàng trung bình"
            value={saleStatic.kichthuocgiohang}
          />
        </Card>

        <Card bordered={false} style={cardStyle}>
          <Statistic
            title="Số lượng sản phẩm đã bán"
            value={saleStatic.spdaban}
          />
        </Card>

        <Card bordered={false} style={cardStyle}>
          <Statistic title="Khách hàng mới" value={saleStatic.khachhangmoi} />
        </Card>

        <Card
          title="Top cửa hàng có doanh thu cao nhất"
          bordered={false}
          style={cardStyle2}
        >
          
        </Card>

        <Card
          title="Top nhân viên bán hàng"
          bordered={false}
          style={cardStyle2}
        >
          
        </Card>


        <Card
          title="Top sản phẩm bán chạy nhất"
          bordered={false}
          style={cardStyle2}
        >
          
        </Card>



      </Flex>
      <br />
    </PageContent>
  );
};

export default Dashboard;
