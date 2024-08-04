import React from "react";
import { Breadcrumb, Typography, Layout, theme } from "antd";

const { Title } = Typography;

const PageHeader = ({ breadcrumbItems }) => {
  // const lastItem = breadcrumbItems.slice(-1);
  const {
    token: { fontSizeHeading4 },
  } = theme.useToken();

  return (
    <div>
      <Breadcrumb items={breadcrumbItems} />
      <Title
        level={1}
        style={{
          margin: "8px 0 0",
          fontSize: fontSizeHeading4,
          lineHeight: 1.5,
        }}
      >
        {/* {lastItem[0].title} */}
      </Title>
    </div>
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
        marginTop: "16px",
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
