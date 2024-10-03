import React, { useState } from "react";
import {
  PageContent,
  PageHeader,
} from "@/components/layout/PageContent";
import { Row, Col, Input, Flex, Card } from "antd";
import { HomeOutlined} from "@ant-design/icons";
import { Link } from "react-router-dom";

const { Search } = Input;

const breadcrumbItems = [
  {
    title: (
      <Link to="/">
        <HomeOutlined />
      </Link>
    ),
  },
  {
    title: "Bán hàng",
  },
];

const Pos = () => {

  // --- search product

  // --------------------------------- Card tab ---------------------------------
  const [activeTabKey, setActiveTabKey] = useState('sell');

  const tabListNoTitle = [
    {
      key: 'sell',
      label: 'Bán trực tiếp',
    },
    {
      key: 'order',
      label: 'Đặt hàng',
    }
  ];

  const onTab2Change = (key) => {
    setActiveTabKey(key);
  };

  const Orderform = () => {

     return (
      <p>app content aa</p>
     );
  }

  // --------------------------------- x ---------------------------------

  return (
    <PageContent>
      <PageHeader breadcrumbItems={breadcrumbItems}></PageHeader>
      <Row>
        <Col span={12}>
          <Flex justify="center">
            <Search
              placeholder="Tìm kiếm theo tên sản phẩm, mã vạch"
              allowClear
              enterButton
              // onSearch={handleSubmitSearch}
              style={{ width: "400px" }}
              size="large"
            />
          </Flex>
        </Col>

        {/* Form */}
        <Col span={12}>
          <Card
            style={{
              width: "100%",
            }}
            tabList={tabListNoTitle}
            activeTabKey={activeTabKey}
            onTabChange={onTab2Change}
            tabProps={{
              size: "middle",
            }}
          >
            <Orderform/>
          </Card>
        </Col>
      </Row>
    </PageContent>
  );
};

export default Pos;
