import React, { useContext } from "react";
import { Form, Input, Button, Typography } from "antd";
import { UserOutlined, LockOutlined } from "@ant-design/icons";
import "./LoginPage.css";
import { AuthContext } from "../../contexts/AuthContext";

const { Title } = Typography;

export default function LoginPage(props) {
  const { login } = useContext(AuthContext);
  const onFinish = (values) => {
    login(values);
  };

  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };

  return (
    <div className="login-container">
      <Form
        name="normal_login"
        className="form"
        initialValues={{ remember: true }}
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
      >
        <Title level={3} style={{ textAlign: "center", marginBottom: "32px" }}>
          Нэвтрэх
        </Title>
        <Form.Item
          name="email"
          rules={[{ required: true, message: "Email-ээ оруулна уу!" }]}
        >
          <Input
            prefix={<UserOutlined className="site-form-item-icon" />}
            placeholder="Email"
          />
        </Form.Item>
        <Form.Item
          name="password"
          rules={[{ required: true, message: "Нууц үгээ оруулна уу!" }]}
        >
          <Input
            prefix={<LockOutlined className="site-form-item-icon" />}
            type="password"
            placeholder="Нууц үг"
          />
        </Form.Item>

        <Form.Item>
          <Button
            type="primary"
            htmlType="submit"
            className="login-form-button"
            style={{
              width: "100%",
            }}
          >
            Нэвтрэх
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
}
