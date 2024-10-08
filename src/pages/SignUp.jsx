import React, { useState } from "react";
import { Form, Input, Typography, Button, Flex, Checkbox, message } from "antd";
import { LockOutlined, UserOutlined, GlobalOutlined } from "@ant-design/icons";
import { Link, useNavigate } from "react-router-dom";
import { uniqueValidator, VALIDATE_PATTERNS } from "@/utils";
import { AuthenticationSerivce } from "@/apis/AuthenticationSerivce";

const Title = Typography.Title;

const SignUp = () => {
  // -------------------- Form attrs --------------------
  const [form] = Form.useForm();
  // eslint-disable-next-line no-unused-vars
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const [usedEmail, setUsedEmail] = useState([]);
  const [usedName, setUsedName] = useState([]);

  const handleError = (postPutData, error) => {
    // Error
    console.log(error);

    if (error?.response?.status === 400) {
      const errorCode = error.response.data.code;

      // handle unique
      if (errorCode === -300) {
        message.error("Email đã được sử dụng!");
        setUsedEmail((prev) => [...prev, postPutData.email]);
      } else if (errorCode === -302) {
        message.error("Tên miền đã được đăng ký!");
        setUsedName((prev) => [...prev, postPutData.name]);
      } else {
        console.error("Uncatch conflict error message", error);
      }
      return;
    }
  };

  const handleSignup = async (data) => {
    console.log(data);

    if (!data.remember) {
      message.warning("Bạn cần đồng ý với điều khoản sử dụng!");
      return;
    }

    delete data.remember;
    delete data.passwordagain;

    try {
      await AuthenticationSerivce.signup(data);
      navigate("/login");
    } catch (error) {
      handleError(data, error);
    }
  };

  return (
    <div
      style={{
        backgroundColor: "#fafafa",
        padding: "24px 48px",
        borderRadius: "24px",
      }}
    >
      <Flex
        justify="center"
        align="center"
        style={{
          width: "100%",
          height: "100vh",
        }}
      >
        <Flex justify="center" vertical align="center">
          <Title>Đăng ký</Title>

          <br />
          <Form
            name="login"
            layout="vertical"
            form={form}
            onFinish={handleSignup}
            requiredMark={false}
            style={{
              maxWidth: 400,
            }}
          >
            <Form.Item
              name="fullName"
              label="Họ và tên"
              rules={[
                {
                  required: true,
                  message: "Vui lòng nhập họ và tên!",
                },
              ]}
            >
              <Input placeholder="Họ và tên" />
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
                  message: "Tên cửa hàng không hợp lệ!",
                },
                {
                  validator: (_, value) =>
                    uniqueValidator(value, usedName, "Tên hiển thị"),
                },
              ]}
            >
              <Input
                addonBefore={<GlobalOutlined />}
                placeholder="Tên cửa hàng của bạn"
                addonAfter=".chainretail.io.vn" // TODO: read
                onInput={(e) => (e.target.value = e.target.value.toLowerCase())}
              />
            </Form.Item>

            <Form.Item
              name="email"
              label="Email"
              rules={[
                {
                  required: true,
                  message: "Vui lòng nhập email!",
                },
                {
                  type: "email",
                  message: "Email không hợp lệ!",
                },
                {
                  validator: (_, value) =>
                    uniqueValidator(value, usedEmail, "Email"),
                },
              ]}
            >
              <Input prefix={<UserOutlined />} placeholder="Email" />
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
              <Input.Password
                prefix={<LockOutlined />}
                placeholder="Mật khẩu"
              />
            </Form.Item>

            <Form.Item
              name="passwordagain"
              label="Nhập lại mật khẩu"
              rules={[
                {
                  required: true,
                  message: "Vui lòng nhập lại mật khẩu!",
                },
                {
                  validator: (_, value) =>
                    value === form.getFieldValue("password") || !value
                      ? Promise.resolve()
                      : Promise.reject(
                          "Mật khẩu phải trùng khớp với mật khẩu bên trên!"
                        ),
                },
              ]}
            >
              <Input.Password
                prefix={<LockOutlined />}
                placeholder="Nhập lại mật khẩu"
              />
            </Form.Item>

            {/* TODO: checkbox agree */}
            <Form.Item>
              <Flex justify="space-between" align="center">
                <Form.Item name="remember" valuePropName="checked" noStyle>
                  <Checkbox>
                    Tôi đồng ý với <Link to="">điều khoản sử dụng</Link>
                  </Checkbox>
                </Form.Item>
              </Flex>
            </Form.Item>

            <Form.Item>
              <Button
                block
                type="primary"
                htmlType="submit"
                loading={loading}
                size="large"
              >
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
        </Flex>
      </Flex>
    </div>
  );
};

export default SignUp;
