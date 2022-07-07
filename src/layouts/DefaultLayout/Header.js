import React, { useContext } from "react";
import { Layout, Button, Space } from "antd";
import { MenuUnfoldOutlined, MenuFoldOutlined } from "@ant-design/icons";
import { AuthContext } from "../../contexts/AuthContext";

export default function Header(props) {
  const { logout } = useContext(AuthContext);
  return (
    <Layout.Header
      className="site-layout-background"
      style={{ padding: 0, paddingRight: "24px" }}
    >
      <div className="space-align-container">
        {React.createElement(
          props.collapsed ? MenuUnfoldOutlined : MenuFoldOutlined,
          {
            className: "trigger",
            onClick: props.toggle,
          }
        )}
        <Space align="center">
          <Button
            onClick={() => {
              logout();
            }}
          >
            Logout
          </Button>
        </Space>
      </div>
    </Layout.Header>
  );
}
