import React from "react";
import {
  ContentBox,
  PageContent,
  PageHeader,
} from "@/components/layout/PageContent";
import { HomeOutlined } from "@ant-design/icons";
import { Link } from "react-router-dom";
import { Row, Col, List } from "antd";
import { Title } from "@/components/common/Title";

const breadcrumbItems = [
  {
    title: (
      <Link to="/">
        <HomeOutlined />
      </Link>
    ),
  },
  {
    title: "Báo cáo",
  },
];

const rowProps = {
  gutter: 24,
};

const colProps = {
  sm: 11,
  xs: 24,
};

const Report = () => {
  const sale = [
    {
      text: "Báo cáo bán hàng theo thời gian",
      path: "/report/1",
    },
    {
      text: "Báo cáo bán hàng theo sản phẩm",
      path: "/report/2",
    },
    {
      text: "Báo cáo bán hàng theo nhóm sản phẩm",
      path: "/report/3",
    },
    {
      text: "Báo cáo bán hàng theo nhân viên",
      path: "/report/4",
    },
    {
      text: "Báo cáo bán hàng theo cửa hàng",
      path: "/report/5",
    },
    {
      text: "Báo cáo bán hàng theo khách hàng",
      path: "/report/6",
    },
  ];

  const purchase = [
    {
      text: "Báo cáo nhập hàng theo thời gian",
      path: "/report/7",
    },
    {
      text: "Báo cáo nhập hàng theo cửa hàng",
      path: "/report/8",
    },
    {
      text: "Báo cáo nhập hàng theo nhà cung cấp",
      path: "/report/9",
    },
  ];

  const inventory = [
    // {
    //   text: "Báo cáo tồn kho",
    //   path: "/report/10",
    // },
    {
      text: "Phân tích ABC",
      path: "/report/11",
    },
    {
      text: "Phân tích FSN",
      path: "/report/12",
    },
  ]
  

  return (
    <PageContent>
      <PageHeader breadcrumbItems={breadcrumbItems}></PageHeader>

      <ContentBox>

        <Row {...rowProps}>
          <Col {...colProps} style={{ margin: 12 }}>
            <List
              header={<Title>Bán hàng</Title>}
              bordered
              dataSource={sale}
              renderItem={(item) => (
                <List.Item>
                  <Link to={item.path} >{item.text}</Link>
                </List.Item>
              )}
            />
          </Col>

          <Col {...colProps} style={{ margin: 12 }}>
            <List
              header={<Title>Nhập hàng</Title>}
              bordered
              dataSource={purchase}
              renderItem={(item) => (
                <List.Item>
                  <Link to={item.path} >{item.text}</Link>
                </List.Item>
              )}
            />
          </Col>

          <Col {...colProps} style={{ margin: 12 }}>
            <List
              header={<Title>Sản phẩm</Title>}
              bordered
              dataSource={inventory}
              renderItem={(item) => (
                <List.Item>
                  <Link to={item.path} >{item.text}</Link>
                </List.Item>
              )}
            />
          </Col>
        </Row>
      </ContentBox>
    </PageContent>
  );
};

export default Report;
