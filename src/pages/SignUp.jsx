import React, { useState } from "react";
import { Form, Input, Typography, Button, Flex, Checkbox } from "antd";
import { LockOutlined, UserOutlined, GlobalOutlined } from '@ant-design/icons';
import { Link } from "react-router-dom";
import { VALIDATE_PATTERNS } from "@/utils";

const Title = Typography.Title;

const SignUp = () => {

  // -------------------- Form attrs --------------------
  const [form] = Form.useForm();
  // eslint-disable-next-line no-unused-vars
  const [loading, setLoading] = useState(false);

  return (
    <div
      style={{
        backgroundColor: "#ffffff",
        padding: "24px 48px",
        borderRadius: "24px",
      }}
    >
      <Flex justify="center">
        <Title>Đăng ký</Title>
      </Flex>
      <br/>
      <Form
        name="login"
        layout="vertical"
        form={form}
        onFinish={()=>{}}
        requiredMark={false}
        style={{
          maxWidth: 600,
        }}
      >
        <Form.Item
          name="fullname"
          label="Họ và tên"
          rules={[
            {
              required: true,
              message: 'Vui lòng nhập họ và tên!',
            },
          ]}
        >
          <Input placeholder="Username" />
        </Form.Item>

        <Form.Item
          name="tenant"
          label="Cửa hàng"
          rules={[
            {
              required: true,
              message: "Vui lòng nhập tên cửa hàng!",
            },
            {
              pattern: VALIDATE_PATTERNS.TENANT_NAME_REGIS,
              message: "Tên cửa hàng không hợp lệ!"
            }
          ]}
        >
          <Input
            addonBefore={<GlobalOutlined />}
            placeholder="Tên cửa hàng của bạn"
            addonAfter=".chainretail.io.vn" // TODO: read
            onInput={(e) => e.target.value = e.target.value.toLowerCase()}
          />
        </Form.Item>
        
        <Form.Item
          name="email"
          label="Email"
          rules={[
            {
              required: true,
              message: 'Vui lòng nhập email!',
            },
            {
              type: "email",
              message: "Email không hợp lệ!"
            }
          ]}
        >
          <Input prefix={<UserOutlined />} placeholder="email" />
        </Form.Item>

        <Form.Item
          name="password"
          label="Mật khẩu"
          rules={[
            {
              required: true,
              message: 'Vui lòng nhập mật khẩu!',
            },
          ]}
        >
          <Input.Password prefix={<LockOutlined />}  placeholder="Mật khẩu" />
        </Form.Item>

        <Form.Item
          name="passwordagain"
          label="Nhập lại mật khẩu"
          rules={[
            {
              required: true,
              message: 'Vui lòng nhập lại mật khẩu!',
            },
          ]}
        >
          <Input.Password prefix={<LockOutlined />} placeholder="Nhập lại mật khẩu" />
        </Form.Item>

        {/* TODO: checkbox agree */}
        <Form.Item>
          <Flex justify="space-between" align="center">
            <Form.Item name="remember" valuePropName="checked" noStyle>
              <Checkbox>Tôi đồng ý với <Link to="">điều khoản sử dụng</Link></Checkbox>
            </Form.Item>
          </Flex>
        </Form.Item>

        <Form.Item>
          <Button block type="primary" htmlType="submit" loading={loading} size="large">
            Đăng ký
          </Button>
        </Form.Item>

        <Form.Item>
          <Flex justify="center">
            Đã có tài khoản?&nbsp;
            <Link to="/login">Đăng nhập</Link>
          </Flex>
        </Form.Item>
      </Form>
    </div>
  );
};

export default SignUp;