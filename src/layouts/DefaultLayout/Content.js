import React from "react";
import { Layout } from "antd";

const Content = ({ children }) => {
  return (
    <Layout.Content
      className="site-layout-background"
      style={{
        margin: "24px 16px",
        padding: 24,
        minHeight: "calc(100vh - 64px - 48px)",
      }}
    >
      {children}
    </Layout.Content>
  );
};

export default Content;
