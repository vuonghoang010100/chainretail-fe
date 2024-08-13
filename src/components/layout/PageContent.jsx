import React from "react";
import { Breadcrumb, Typography, Layout, theme, Flex } from "antd";
const { Title } = Typography;

const PageHeader = ({ breadcrumbItems, title, children }) => {
  // const lastItem = breadcrumbItems.slice(-1);
  const {
    token: { fontSizeHeading4 },
  } = theme.useToken();
  
  const header = (
    <div
      style={{
        marginBottom: "24px"
      }}
    >
      <Breadcrumb items={breadcrumbItems} />
      <Title
        level={1}
        style={{
          margin: "8px 0 0",
          fontSize: fontSizeHeading4,
          lineHeight: 1.5,
        }}
      >
        {title ?? breadcrumbItems[breadcrumbItems.length - 1].title}
      </Title>
    </div>
  )

  return (
    <Flex justify="space-between" align="center" >
      {header}
      {children}
    </Flex>
  );
};

const ContentBox = ({ children }) => {
  const {
    token: {
      colorBgContainer,
      borderRadiusLG,
      lineWidth,
      lineType,
      colorBorderSecondary,
      paddingLG,
    },
  } = theme.useToken();

  return (
    <div
      style={{
        // marginTop: "24px",
        padding: paddingLG,
        background: colorBgContainer,
        borderRadius: borderRadiusLG,
        borderWidth: lineWidth,
        borderStyle: lineType,
        borderColor: colorBorderSecondary,
      }}
    >
      {children}
    </div>
  );
};

const PageContent = ({ children }) => {
  const {
    token: { marginLG },
  } = theme.useToken();
  return (
    <Layout.Content
      style={{
        margin: `${marginLG}px ${marginLG}px 0`,
      }}
    >
      {children}
    </Layout.Content>
  );
};

export { PageContent };
export { PageHeader, ContentBox };
