import React from "react";
import { Layout, theme } from "antd";

// eslint-disable-next-line react/prop-types
const ShortContent = ({ children }) => {
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  return (
    <Layout.Content
      style={{
        margin: "24px 24px 0",
      }}
    >
      <div
        style={{
          padding: 24,
          textAlign: "center",
          background: colorBgContainer,
          borderRadius: borderRadiusLG,
        }}
      >
        {children}
        <p>short content</p>
        {
          // indicates very long content
          Array.from(
            {
              length: 25,
            },
            (_, index) => (
              <React.Fragment key={index}>
                {index % 25 === 0 && index ? "more" : "..."}
                <br />
              </React.Fragment>
            )
          )
        }
      </div>
    </Layout.Content>
  );
};

export default ShortContent;
