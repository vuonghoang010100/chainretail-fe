import React from "react";
import { theme } from "antd";

export const Title = ({ children, marginBot }) => {
  // use theme
  const {
    token: { colorText, fontSizeHeading5, fontWeightStrong, titleMarginBottom },
  } = theme.useToken();
  return (
    <p
      style={{
        fontSize: fontSizeHeading5,
        fontWeight: fontWeightStrong,
        color: colorText,
        lineHeight: "1rem",
        margin: "0",
        marginBottom: marginBot ? titleMarginBottom : "0",
      }}
    >
      {children}
    </p>
  );
};
