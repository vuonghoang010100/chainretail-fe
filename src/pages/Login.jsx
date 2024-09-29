import React, { useState } from "react";
import { Form, Input, Typography, Button, Flex } from "antd";
import { LockOutlined, UserOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { AuthenticationSerivce } from "@/apis/AuthenticationSerivce";
import useAuth from "@/hooks/useAuth";

const Title = Typography.Title;

const Login = () => {
  const navigate = useNavigate();
  const { setAuth } = useAuth();
  const tenant = window.location.host.split(".")[0];

  // -------------------- Form attrs --------------------
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  // -------------------- Submit Form --------------------
  const handleSubmit = async (formValues) => {
    setLoading(true);

    const data = {
      tenant: tenant,
      email: formValues.email,
      password: formValues.password,
    };

    try {
      // login
      const response = await AuthenticationSerivce.login(data);
      const token = response.token;
      setAuth(token);

      form.resetFields();
      navigate("/");
    } catch (error) {
      console.log(error);
      // TODO
    }

    setLoading(false);
  };

  return (
    <div
      style={{
        backgroundColor: "#fafafa",
        height: "100%"
      }}
    >
      <Flex
        justify="center"
        align="center"
        style={{
          width: "100%",
          height: "100%"
        }}
      >

      <div>

      
      <Flex justify="center">
        <Title>Đăng nhập</Title>
      </Flex>
      <br />
      <Form
        name="login"
        layout="vertical"
        form={form}
        onFinish={handleSubmit}
        requiredMark={false}
        style={{
          maxWidth: 600,
        }}
      >
        <Form.Item
          name="email"
          label="Email đăng nhập"
          rules={[
            {
              required: true,
              message: "Vui lòng nhập email!",
            },
            {
              type: "email",
              message: "Email không hợp lệ!",
            },
          ]}
        >
          <Input prefix={<UserOutlined />} placeholder="Email" size="large"/>
        </Form.Item>
        <Form.Item
          name="password"
          label="Mật khẩu"
          rules={[
            {
              required: true,
              message: "Vui lòng nhập mật khẩu!",
            },
          ]}
        >
          <Input.Password prefix={<LockOutlined />} placeholder="Mật khẩu" size="large"/>
        </Form.Item>

        {/* <Form.Item>
          <Flex justify="space-between" align="center">
            <Form.Item name="remember" valuePropName="checked" noStyle>
              <Checkbox>Ghi nhớ đăng nhập</Checkbox>
            </Form.Item>
            <a href="">Quên mật khẩu?</a>
          </Flex>
        </Form.Item> */}

        <Form.Item>
          <Button block type="primary" htmlType="submit" loading={loading} size="large">
            Đăng nhập
          </Button>
        </Form.Item>
      </Form>
      </div>
      </Flex>
    </div>
  );
};

export default Login;
