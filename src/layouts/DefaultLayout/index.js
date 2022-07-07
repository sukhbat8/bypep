import React, { useState } from "react";
import { Layout } from "antd";
import "./DefaultLayout.css";
import SideMenu from "./SideMenu";
import Header from "./Header";
import Content from "./Content";

const DefaultLayout = ({ children }) => {
  const [collapsed, setCollapsed] = useState(false);

  const toggle = () => {
    setCollapsed(!collapsed);
  };
  return (
    <Layout>
      <SideMenu collapsed={collapsed} />
      <Layout className="site-layout">
        <Header collapsed={collapsed} toggle={toggle} />
        <Content>{children}</Content>
      </Layout>
    </Layout>
  );
};

export default DefaultLayout;
